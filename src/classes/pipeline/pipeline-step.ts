import { StepService } from "../../services/step/step.service";
import { Subject } from "rxjs";
import { WorkspaceService } from "../../services/workspace/workspace.service";
import { EnumStepType } from "../../enums/enum-step-type";
import { InputFile } from "../../types/input-file";
import { ArchiveDTO } from "../dtos/models/archive";
import { RessourceService } from "../../services/ressources/ressource.service";
import { ArchiveService } from "../../services/archive/archive.service";
import { SelectorService } from "../../services/selector/selector.service";
import { FileService } from "../../services/utils/file/file.service";

export enum EnumPipelineStepStatus {
    PENDING,         // The step has not been resolved yet
    RESOLVED,        // The step has been resolved but not started yet
    PROCESSING,      // The step is currently being processed with ffmpeg
    ENDED            // The step has ended
};

export abstract class PipelineStep {

    public static readonly IDENTIFIER: string;

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
    private _status: EnumPipelineStepStatus = EnumPipelineStepStatus.PENDING;
    private _statusChanged: Subject<EnumPipelineStepStatus> = new Subject<EnumPipelineStepStatus>();
    protected _processEnded: Subject<any> = new Subject<any>();
    protected _pipelineSteps: PipelineStep[] = [];
    protected _externalOutputFiles: string[] = [];
    protected _outputFileIndex: number = 0;

    /**
     * Create a new pipeline step.
     * @param id The id of the step
     * @param inputs The raw inputs of the step (before resolution)
     * @param instruction The instruction of the step
     */
    constructor(id: number, type: EnumStepType, name: string, args: any, archive?: ArchiveDTO) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.args = args;
        this.archiveOptions = archive;

        if (this.args.input) this._rawInputs = this.args.input;
    }

    public init(pipelineSteps: PipelineStep[]) {
        // Create a workspace folder
        this._workspaceDir = WorkspaceService.createStepFolder(this.id);
        this._workspaceOutputDir = this._workspaceDir + 'output/';
        this._pipelineSteps = pipelineSteps;
        this.startResolution();
    }

    public async run(): Promise<void> {
        console.log(`- Step ${this.id} run...`);
        // Wait until the step is resolved
        await this.waitForStatus(EnumPipelineStepStatus.RESOLVED);
        // Set the status to processing
        console.log(`[*] Step ${this.id} started...`);
        this.setStatus(EnumPipelineStepStatus.PROCESSING);

        // Run the step process (custom to each step)
        const result = await this.process();
        const files = result.concat(this._externalOutputFiles);

        if (this.archiveOptions) this.archive(files);
        // Set the status to ended
        console.log(`[*] Step ${this.id} ended\n`);
        this._processEnded.next(files);
        this.setStatus(EnumPipelineStepStatus.ENDED);
        this.reset();
    }

    private startResolution(): void {
        // For each raw input, resolve it to a file path or a step id
        for (const rawInput of this._rawInputs) {
            console.log(`- Step ${this.id} resolving input ${rawInput}...`);
            console.log(this._pendingInputs.length)
            const inputPromises = StepService.resolveInput(rawInput, this._pipelineSteps, this.id);
            this._pendingInputs = this._pendingInputs.concat(inputPromises);
        }

        // Wait for all the promises to be resolved
        Promise.all(this._pendingInputs).then((inputs) => {
            this._inputs = this._inputs.concat(...inputs);

            console.log(`[*] Step ${this.id} resolved`);
            console.log(`- Step ${this.id} inputs: ${this._inputs}`);
            this.setStatus(EnumPipelineStepStatus.RESOLVED);
            this._inputs = StepService.moveInputFilesToWorkspace(this._inputs, this._workspaceDir);
            this._pendingInputs = [];
        });
    }

    protected archive(files: string[]): void {
        if (!this.archiveOptions) return;
        const filteredFiles = ArchiveService.filterFiles(files, this.archiveOptions.filter);

        // If no target is specified, archive the files in the project output folder
        if (!this.archiveOptions.target) {
            RessourceService.archiveFiles(filteredFiles);
            return;
        }

        const selectorClass = SelectorService.resolve(this.archiveOptions.target);
        const selector = new selectorClass(this.archiveOptions.target, this._pipelineSteps, this.id);

        // TODO: Ensure that the returned value is a step instance (validator ect...)
        const target = selector.resolve().data as PipelineStep;
        target.addExternalOutputFiles(files);
    }

    public addExternalOutputFiles(files: string[]): void {
        if (this._status !== EnumPipelineStepStatus.PROCESSING) {
            throw new Error(`Cannot add output file to step ${this.id} because it is not processing`);
        }
        const renamedFiles = files.map((file) => {
            const fileExt = FileService.getExtension(file);
            const newFilepath = this.newFilepath(fileExt!);
            FileService.copyFile(file, newFilepath);
            return newFilepath;
        });
        // Add the files to the list of external output files
        this._externalOutputFiles = this._externalOutputFiles.concat(renamedFiles);
    }

    /**
     * Wait for the step to reach a specific status.
     * @param status The status to wait for
     * @returns A promise that resolves when the step reaches the specified status
     */
    public waitForStatus(status: EnumPipelineStepStatus): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this._status === status) return resolve();
            this._statusChanged.subscribe((newStatus) => {
                if (newStatus === status) resolve();
            });
        });
    }

    protected newFilepath(extension: string): string {
        throw new Error("Method not implemented.");
    }

    protected async process(): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    /**
     * Set the status of the step.
     * @param status The new status of the step
     */
    private setStatus(status: EnumPipelineStepStatus): void {
        this._status = status;
        this._statusChanged.next(status);
    }

    public get processEnded(): Subject<string[]> {
        return this._processEnded;
    }

    protected reset(): void {
        this._externalOutputFiles = [];
        this._pendingInputs = [];
        this._inputs = [];
        this._outputFileIndex = 0;
    }

}