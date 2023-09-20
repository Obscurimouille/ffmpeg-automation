import { EnumInstruction } from "../../../enums/enum-instruction";
import { EnumPipelineStepStatus, PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../../enums/enum-step-type";
import { InstructionArgsDTO } from "../../dtos/models/args-dto";
import { InputFile } from "../../../types/input-file";
import { InstructionService } from "../../../services/instruction/instruction.service";
import { ArchiveDTO } from "../../dtos/models/archive";

/**
 * A pipeline instruction.
 */
export abstract class PipelineInstruction extends PipelineStep {

    public static override readonly IDENTIFIER: EnumInstruction;

    constructor(id: number, name: string, args: InstructionArgsDTO, archive?: ArchiveDTO) {
        super(id, EnumStepType.INSTRUCTION, name, args, archive);
    }

    public override async process(): Promise<string[]> {
        const outputFiles = await this.FfmpegProcess();
        return outputFiles;
    }

    protected abstract FfmpegProcess(): Promise<InputFile[]>;

}
