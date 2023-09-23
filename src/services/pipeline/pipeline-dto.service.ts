import { plainToClass } from "class-transformer";
import { InstructionDTO } from "../../classes/dtos/models/instruction-dto";
import { StatementDTO } from "../../classes/dtos/models/statement-dto";
import { StepDTO } from "../../classes/dtos/models/step-dto";
import { SegmentDTO } from "../../classes/pipeline/instructions/segment/segment-model";
import { SplitDTO } from "../../classes/pipeline/instructions/split/split-model";
import { EnumInstruction } from "../../enums/enum-instruction";
import { EnumStepType } from "../../enums/enum-step-type";
import { ClassTransformService } from "../plain-to-class/plain-to-class.service";
import { EnumStatement } from "../../enums/enum-statement";
import { ForeachDTO } from "../../classes/pipeline/statement/foreach/foreach-model";
import { SyncDTO } from "../../classes/pipeline/instructions/sync/sync-model";

export class PipelineDTOService {

    /**
     * Resolve a step DTO to a step model.
     * @param step The step DTO to resolve
     * @returns The step model
     */
    public static toStepChildDTO(step: StepDTO): StepDTO {
        if (!step.type) return plainToClass(StepDTO, step);

        switch (step.type) {
            case EnumStepType.INSTRUCTION:
                return PipelineDTOService.toInstructionChildDTO(step as InstructionDTO);

            case EnumStepType.STATEMENT:
                return PipelineDTOService.toStatementChildDTO(step as StatementDTO);

            default:
                return plainToClass(StepDTO, step);
        }
    }

    /**
     * Resolve an instruction DTO to an instruction model.
     * @param instruction The instruction DTO to resolve
     * @returns The instruction model
     */
    public static toInstructionChildDTO(instruction: InstructionDTO): InstructionDTO {
        if (!instruction.name) return plainToClass(InstructionDTO, instruction);

        switch (instruction.name) {
            case EnumInstruction.SEGMENT:
                return ClassTransformService.plainToClass(SegmentDTO, instruction);
            case EnumInstruction.SPLIT:
                return ClassTransformService.plainToClass(SplitDTO, instruction);
            case EnumInstruction.SYNC:
                return ClassTransformService.plainToClass(SyncDTO, instruction);

            default: return plainToClass(InstructionDTO, instruction);
        }
    }

    /**
     * Resolve a statement DTO to a statement model.
     * @param statement The statement DTO to resolve
     * @returns The statement model
     */
    public static toStatementChildDTO(statement: StatementDTO): StatementDTO {
        if (!statement.name) return plainToClass(StatementDTO, statement);

        switch (statement.name) {
            case EnumStatement.FOREACH:
                return ClassTransformService.plainToClass(ForeachDTO, statement);

            default: return plainToClass(StatementDTO, statement);
        }
    }

}