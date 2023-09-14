import { FfmpegCommand } from "../../services/ffmpeg/ffmpeg.service";
import { EnumInstruction } from "../../enums/enum-instruction";
import { PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../enums/enum-step-type";
import { InstructionArgsDTO } from "../dtos/args-dto";

/**
 * A pipeline instruction.
 */
export class PipelineInstruction extends PipelineStep {

    public static readonly IDENTIFIER: EnumInstruction;

    /* -------------------------------------------------------------------------- */

    constructor(id: number, name: string, args: InstructionArgsDTO) {
        console.log(`Creating instruction ${id}...`);
        super(id, EnumStepType.INSTRUCTION, name, args);
        this.args = args;
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
        // if (!this.inputFiles || !this.outputDir) {
        //     throw new Error("Instruction data not set");
        // }

        // return this.processCommand(command);
        return [];
    }

}
