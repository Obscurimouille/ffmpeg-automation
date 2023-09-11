import { FfmpegCommand } from "../../services/ffmpeg/ffmpeg.service";
import { PipelineInstructionRequirements } from "../../types/pipeline-instructions-requirements";
import { PipelineInstructionArgsModel } from "../../types/pipeline-model";

/**
 * A pipeline instruction.
 */
export class PipelineInstruction {

    public static readonly IDENTIFIER: string;
    public static readonly REQUIREMENTS: PipelineInstructionRequirements;

    protected args: PipelineInstructionArgsModel;
    protected inputFiles?: string[];
    protected outputDir?: string;

    constructor(args:PipelineInstructionArgsModel) {
        this.args = args;
    }

    public setStepData(inputFiles: string[], outputDir: string) {
        this.inputFiles = inputFiles;
        this.outputDir = outputDir;
    }

    /**
     * Decorate the given command depending on the instruction.
     * @param command The command to decorate
     * @returns The output files
     */
    protected processCommand(command: FfmpegCommand): string[] {
        return [];
    }

    public decorateCommand(command: FfmpegCommand): string[] {
        if (!this.inputFiles || !this.outputDir) {
            throw new Error("Instruction data not set");
        }

        return this.processCommand(command);
    }

}
