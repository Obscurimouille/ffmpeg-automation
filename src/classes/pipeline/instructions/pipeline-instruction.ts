import { EnumInstruction } from "../../../enums/enum-instruction";
import { PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../../enums/enum-step-type";
import { InstructionArgsDTO } from "../../dtos/models/args-dto";
import { InputFile } from "../../../types/input-file";
import { ArchiveDTO } from "../../dtos/models/archive";
import { InstructionDTO } from "../../dtos/models/instruction-dto";

/**
 * A pipeline instruction.
 */
export abstract class PipelineInstruction extends PipelineStep {

    public static override readonly IDENTIFIER: EnumInstruction;
    public static override readonly DTO_MODEL: InstructionDTO;

    constructor(id: number, name: string, args: InstructionArgsDTO, archive?: ArchiveDTO) {
        super(id, EnumStepType.INSTRUCTION, name, args, archive);
    }

    public override async process(): Promise<string[]> {
        const outputFiles = await this.FfmpegProcess();
        return outputFiles;
    }

    protected abstract FfmpegProcess(): Promise<InputFile[]>;

}
