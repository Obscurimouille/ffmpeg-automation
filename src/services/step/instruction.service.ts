import { ClassConstructor } from "class-transformer";
import { PipelineInstruction } from "../../classes/pipeline/instructions/pipeline-instruction";
import { InstructionDTO } from "../../classes/dtos/models/instruction-dto";
import { INSTRUCTIONS } from "../../declaration";

export class InstructionService {

    /**
     * Resolve an instruction model to an instruction class.
     * @param name The instruction name to resolve
     * @returns The instruction class
     */
    public static resolve(name: string): ClassConstructor<PipelineInstruction> {
        const instructionClass = INSTRUCTIONS.find((instruction: ClassConstructor<PipelineInstruction>) => name == (instruction as any).IDENTIFIER);
        if (!instructionClass) throw new Error(`Instruction ${name} not found`);
        return instructionClass;
    }

    /**
     * Resolve an instruction model to an instruction class.
     * @param name The instruction name to resolve
     * @returns The instruction class
     */
    public static resolveDTOModel(name: string): ClassConstructor<InstructionDTO> {
        const instructionClass = INSTRUCTIONS.find((instruction: ClassConstructor<PipelineInstruction>) => name == (instruction as any).IDENTIFIER);
        if (!instructionClass) throw new Error(`Instruction ${name} not found`);
        return (instructionClass as any).DTO_MODEL;
    }

}