import { InstructionDTO } from "../../classes/dtos/models/instruction-dto";
import { StatementDTO } from "../../classes/dtos/models/statement-dto";
import { StepDTO } from "../../classes/dtos/models/step-dto";
import { SegmentDTO } from "../../classes/instructions/segment/segment-model";
import { SplitDTO } from "../../classes/instructions/split/split-model";
import { EnumInstruction } from "../../enums/enum-instruction";
import { EnumStepType } from "../../enums/enum-step-type";
import { ClassTransformService } from "../plain-to-class/plain-to-class.service";

export class PipelineDTOService {

    /**
     * Resolve a step DTO to a step model.
     * @param step The step DTO to resolve
     * @returns The step model
     */
    public static toStepChildDTO(step: StepDTO): StepDTO {
        if (!step.type) throw new Error('Step type is not defined');

        switch (step.type) {
            case EnumStepType.INSTRUCTION:
                return PipelineDTOService.toInstructionChildDTO(step);

            case EnumStepType.STATEMENT:
                return PipelineDTOService.toStatementChildDTO(step);

            default:
                throw new Error('Unknown step type');
        }
    }

    /**
     * Resolve an instruction DTO to an instruction model.
     * @param instruction The instruction DTO to resolve
     * @returns The instruction model
     */
    public static toInstructionChildDTO(instruction: InstructionDTO): InstructionDTO {
        if (!instruction.name) throw new Error('Instruction name is not defined');

        switch (instruction.name) {
            case EnumInstruction.SEGMENT:
                return ClassTransformService.plainToClass(SegmentDTO, instruction);
            case EnumInstruction.SPLIT:
                return ClassTransformService.plainToClass(SplitDTO, instruction);

            default: throw new Error('Unknown instruction');
        }
    }

    /**
     * Resolve a statement DTO to a statement model.
     * @param statement The statement DTO to resolve
     * @returns The statement model
     */
    public static toStatementChildDTO(statement: StatementDTO): StatementDTO {
        if (!statement.name) throw new Error('Instruction name is not defined');

        switch (statement.name) {
            default: throw new Error('Unknown instruction');
        }
    }

}