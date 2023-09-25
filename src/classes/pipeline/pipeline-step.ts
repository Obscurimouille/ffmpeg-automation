import { StepService } from "../../services/step/step.service";
import { Subject } from "rxjs";
import { WorkspaceService } from "../../services/workspace/workspace.service";
import { EnumStepType } from "../../enums/enum-step-type";
import { InputFile } from "../../types/input-file";
import { ArchiveDTO } from "../dtos/models/archive";
import { ResourceService } from "../../services/resources/resource.service";
import { ArchiveService } from "../../services/archive/archive.service";
import { SelectorService } from "../../services/selector/selector.service";
import { FileService } from "../../services/utils/file/file.service";
import { EnumStepStatus } from "../../enums/enum-step-status";
import { EnumSelectorOutputType } from "../../enums/enum-selector-output-type";
import path from "path";
import { StepDTO } from "../dtos/models/step-dto";

export abstract class PipelineStep {

    public static readonly IDENTIFIER: string;
    public static readonly DTO_MODEL: StepDTO;

    public type!: EnumStepType;
    public name!: string;
    public id!: number;
    public args!: any;
    protected archiveOptions?: ArchiveDTO;

    /* -------------------------------------------------------------------------- */

    private _rawInputs: InputFile[] = [];
    protected _inputs: InputFile[] = [];
    protected _workspaceDir!: string;
    protected _workspaceOutputDir!: string;
    private _pendingInputs: Promise<InputFile[]>[] = [];
    private _status: EnumStepStatus = EnumStepStatus.PENDING;
    private _statusChanged: Subject<EnumStepStatus> = new Subject<EnumStepStatus>();
    private _endedSubject: Subject<string[]> = new Subject<string[]>();
    protected _pipelineSteps: PipelineStep[] = [];
    private _externalOutputFiles: string[] = [];
    protected _outputFileIndex: number = 0;

    /**
     * Create a new pipeline step.
     * @param id The id of the step
     * @param type The type of the step (instruction, statement, ...)
     * @param name The name of the step
     * @param args The arguments of the step
     * @param archive The archive options (optional)
     */
    constructor(id: number, type: EnumStepType, name: string, args: any, archive?: ArchiveDTO) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.args = args;
        this.archiveOptions = archive;

        if (this.args.input) this._rawInputs = this.args.input;
    }

    /**
     * Initialize the step.
     * - A set of steps is passed to resolve references to other steps
     *
     * @param pipelineSteps The list of steps of the pipeline
     */
    public init(pipelineSteps: PipelineStep[]): void {
        // Create a workspace folder
        this._workspaceDir = WorkspaceService.createStepFolder(this.id);
        this._workspaceOutputDir = path.join(this._workspaceDir, 'output');
        this._pipelineSteps = pipelineSteps;
        this.startResolution();
    }

    /**
     * Run the step.
     * - Wait until the step is resolved
     */
    public async run(): Promise<void> {
        console.log(`- Step ${this.id} run...`);
        // Wait until the step is resolved
        await this.waitForStatus(EnumStepStatus.RESOLVED);
        // Set the status to processing
        console.log(`[*] Step ${this.id} started...`);
        this.setStatus(EnumStepStatus.PROCESSING);

        // Run the step process (custom to each step)
        const result = await this.process();
        const files = result.concat(this._externalOutputFiles);

        if (this.archiveOptions) this.archive(files);
        // Set the status to ended
        console.log(`[*] Step ${this.id} ended\n`);
        this._endedSubject.next(files);
        this.setStatus(EnumStepStatus.ENDED);
    }

    /**
     * Start the resolution of the step inputs.
     * - For each raw input, resolve it to a promise that resolves to a set of file path
     * - When all the promises are resolved, move the files to the step workspace
     * - When all the files are moved, set the status to resolved
     */
    private startResolution(): void {
        // For each raw input, resolve it to a file path or a step id
        for (const rawInput of this._rawInputs) {
            const inputPromises = StepService.resolveInput(rawInput, this._pipelineSteps, this.id);
            this._pendingInputs = this._pendingInputs.concat(inputPromises);
        }

        // Wait for all the promises to be resolved
        Promise.all(this._pendingInputs).then((inputs) => {
            this._inputs = this._inputs.concat(...inputs);

            console.log(`[*] Step ${this.id} resolved`);
            this.setStatus(EnumStepStatus.RESOLVED);
            this._inputs = StepService.moveInputFilesToWorkspace(this._inputs, this._workspaceDir);
            this._pendingInputs = [];
        });
    }

    /**
     * Archive a list of files.
     * - If options are not defined, the files are not archived
     * - If a target is specified, the files are moved to the target step (addExternalOutputFiles)
     * - If no target is specified, the files are archived in the project output folder
     * - If a filter is specified, the files are filtered before being archived
     *
     * @param files The list of files to archive
     */
    private async archive(files: string[]): Promise<void> {
        if (!this.archiveOptions) return;
        const filteredFiles = ArchiveService.filterFiles(files, this.archiveOptions.filter);

        // If no target is specified, archive the files in the project output folder
        if (!this.archiveOptions.target) {
            ResourceService.archiveFiles(filteredFiles);
            return;
        }

        const selectorClass = SelectorService.resolve(this.archiveOptions.target);
        const selector = new selectorClass(this.archiveOptions.target, this._pipelineSteps, this.id);
        selector.init();
        if (selector.getExpectedOutputType() !== EnumSelectorOutputType.STEP_INSTANCE) {
            throw new Error(`Invalid archive target for step ${this.id}. The selector must target an instance of a step.`);
        }

        const target = (await selector.resolve().data) as PipelineStep;
        target.addExternalOutputFiles(files);
    }

    /**
     * Add external output files to the step.
     * - Used to add output files from a step to another step
     * - For example, the child steps of a foreach add their output files to the foreach step
     *   if archive target is set to '@parent'
     * - Can only be called when the step is processing
     *
     * @param files The list of files to add
     */
    public addExternalOutputFiles(files: string[]): void {
        if (this._status !== EnumStepStatus.PROCESSING) {
            throw new Error(`Cannot add output file to step ${this.id} because it is not processing`);
        }
        // Move each file to the step workspace output folder
        const relocatedFiles = files.map((file) => {
            const fileExt = FileService.getExtension(file);
            const newFilepath = this.newFilepath(fileExt!);
            FileService.copyFile(file, newFilepath);
            return newFilepath;
        });
        // Add the files to the list of external output files
        this._externalOutputFiles = this._externalOutputFiles.concat(relocatedFiles);
    }

    /**
     * Wait for the step to reach a specific status.
     * @param status The status to wait for
     * @returns A promise that resolves when the step reaches the specified status
     */
    public waitForStatus(status: EnumStepStatus): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this._status === status) return resolve();
            this._statusChanged.subscribe((newStatus) => {
                if (newStatus === status) resolve();
            });
        });
    }

    /**
     * Generate a new file path for the step.
     * - used to name the output files of the step
     * - Should be implemented by each step that generates output files
     * @param extension The extension of the file
     * @returns The new file path
     */
    protected newFilepath(extension: string): string {
        throw new Error("Method not implemented.");
    }

    /**
     * Step process.
     * - Should be implemented by each step
     * - The process is called when the step has been resolved
     * - The process should return a list of output files
     * @returns The list of output files
     */
    protected abstract process(): Promise<string[]>;

    /**
     * Set the status of the step.
     * @param status The new status of the step
     */
    private setStatus(status: EnumStepStatus): void {
        this._status = status;
        this._statusChanged.next(status);
    }

    /**
     * Getter: Ended subject
     * - A subject that is triggered when the step ends
     * - The subject data is the list of output files
     * @returns The ended subject
     */
    public get endedSubject(): Subject<string[]> {
        return this._endedSubject;
    }

}