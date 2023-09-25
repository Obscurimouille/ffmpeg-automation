import { plainToClass } from "class-transformer";
import { InstructionDTO } from "../../classes/dtos/models/instruction-dto";
import { StatementDTO } from "../../classes/dtos/models/statement-dto";
import { StepDTO } from "../../classes/dtos/models/step-dto";
import { EnumStepType } from "../../enums/enum-step-type";
import { InstructionService } from "../step/instruction.service";
import { StatementService } from "../step/statement.service";
import { ClassTransformService } from "../plain-to-class/plain-to-class.service";

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
                return ClassTransformService.plainToClass(StepDTO, step);
        }
    }

    /**
     * Resolve an instruction DTO to an instruction model.
     * @param instruction The instruction DTO to resolve
     * @returns An instance of the instruction model DTO
     */
    public static toInstructionChildDTO(instruction: InstructionDTO): InstructionDTO {
        if (!instruction.name) return ClassTransformService.plainToClass(InstructionDTO, instruction);
        const modelClass = InstructionService.resolveDTOModel(instruction.name);
        return ClassTransformService.plainToClass(modelClass, instruction);
    }

    /**
     * Resolve a statement DTO to a statement model.
     * @param statement The statement DTO to resolve
     * @returns An instance of the statement model DTO
     */
    public static toStatementChildDTO(statement: StatementDTO): StatementDTO {
        if (!statement.name) return ClassTransformService.plainToClass(StatementDTO, statement);
        const modelClass = StatementService.resolveDTOModel(statement.name);
        return ClassTransformService.plainToClass(modelClass, statement);
    }

}