import { PipelineInstruction } from "./instructions/pipeline-instruction";
import { PipelineStepService } from "../services/pipeline-step/pipeline-step.service";
import { Subject } from "rxjs";
import { WorkspaceService } from "../services/workspace/workspace.service";
import { FfmpegService } from "../services/ffmpeg/ffmpeg.service";

export enum EnumPipelineStepStatus {
    PENDING,         // The step has not been resolved yet
    RESOLVED,        // The step has been resolved but not started yet
    PROCESSING,      // The step is currently being processed with ffmpeg
    ENDED            // The step has ended
};

export class PipelineStep {

    private _index: number;
    private _rawInputs: string[];
    private _inputs: string[] = [];
    private _workspaceDir: string;
    private _pendingInputs: Promise<string[]>[] = [];
    private _instruction: PipelineInstruction;
    private _status: EnumPipelineStepStatus = EnumPipelineStepStatus.PENDING;
    private _statusChanged: Subject<EnumPipelineStepStatus> = new Subject<EnumPipelineStepStatus>();
    private _processEnded: Subject<string[]> = new Subject<string[]>();

    /**
     * Create a new pipeline step.
     * @param index The index of the step
     * @param inputs The raw inputs of the step (before resolution)
     * @param instruction The instruction of the step
     */
    constructor(index: number, inputs: string[], instruction: PipelineInstruction) {
        console.log(`Creating step ${index}...`);
        this._index = index;
        this._rawInputs = inputs;
        this._instruction = instruction;

        // Create a workspace folder
        this._workspaceDir = WorkspaceService.createStepFolder(this.index);
    }


    public async run(): Promise<void> {
        // Wait until the step is resolved
        await this.waitForStatus(EnumPipelineStepStatus.RESOLVED);

        console.log(`Running step ${this.index}...`);

        this.setStatus(EnumPipelineStepStatus.PROCESSING);

        const outputDir = this._workspaceDir + 'output/';
        const outputFiles = await FfmpegService.process(this._inputs, this._instruction, outputDir);
        this._processEnded.next(outputFiles);
        this.setStatus(EnumPipelineStepStatus.ENDED);
    }

    public startResolution(otherSteps: PipelineStep[]): void {
        console.log(`Resolving step ${this.index}...`);

        // For each raw input, resolve it to a file path or a step index
        for (const rawInput of this._rawInputs) {

            const data = PipelineStepService.resolveInput(rawInput);

            for (const result of data) {

                // The result is a file path
                if (typeof result === 'string') {
                    this._inputs.push(result);
                }
                // The result is a step index so we have to wait for the step to be resolved
                else if (typeof result === 'number') {
                    // Find the step associated with the received index
                    const associatedStep = PipelineStepService.findStepByIndex(otherSteps, result);

                    if (!associatedStep) {
                        throw new Error(`Step ${this.index} could not find step ${result}`);
                    }
                    // Add a promise to the array of promises to be resolved
                    this._pendingInputs.push(new Promise<string[]>((resolve) => {
                        // And subscribe to the processEnded event of the associated step
                        associatedStep.processEnded.subscribe((outputs) => {
                            resolve(outputs);
                        });
                    }));
                }
            }
        }

        // Wait for all the promises to be resolved
        Promise.all(this._pendingInputs).then((inputs) => {
            // Flatten the array of inputs
            this._inputs = this._inputs.concat(...inputs);

            // Next status
            this.setStatus(EnumPipelineStepStatus.RESOLVED);
            this._inputs = PipelineStepService.moveInputFilesToWorkspace(this._inputs, this._workspaceDir);
        });
    }

    public waitForStatus(status: EnumPipelineStepStatus): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this._status === status) {
                resolve();
            }
            else {
                this._statusChanged.subscribe((newStatus) => {
                    if (newStatus === status) {
                        resolve();
                    }
                });
            }
        });
    }

    public setStatus(status: EnumPipelineStepStatus): void {
        this._status = status;
        this._statusChanged.next(status);
    }

    public get processEnded(): Subject<string[]> {
        return this._processEnded;
    }

    public get index(): number {
        return this._index;
    }

}