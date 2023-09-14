import { ClassConstructor } from "class-transformer";
import { PipelineInstruction } from "../../classes/instructions/pipeline-instruction";
import { Segment } from "../../classes/instructions/segment/segment";
import { InstructionDTO } from "../../classes/dtos/instruction-dto";

export class PipelineInstructionService {

    private static INSTRUCTIONS: ClassConstructor<PipelineInstruction>[] = [
        Segment
    ];

    /**
     * Resolve an instruction model to an instruction class.
     * @param name The instruction name to resolve
     * @returns The instruction class
     */
    public static resolve(name: string): ClassConstructor<PipelineInstruction> {
        const instructionClass = this.INSTRUCTIONS.find((instruction: ClassConstructor<PipelineInstruction>) => name == (instruction as any).IDENTIFIER);
        if (!instructionClass) throw new Error(`Instruction ${name} not found`);
        return instructionClass;
    }

    /**
     * Resolve an instruction model to an instruction class.
     * @param name The instruction name to resolve
     * @returns The instruction class
     */
    public static resolveModel(name: string): ClassConstructor<InstructionDTO> {
        const instructionClass = this.INSTRUCTIONS.find((instruction: ClassConstructor<PipelineInstruction>) => name == (instruction as any).IDENTIFIER);
        if (!instructionClass) throw new Error(`Instruction ${name} not found`);
        return (instructionClass as any).DTO;
    }

    /**
     * Create an instruction instance from an instruction model.
     * @param instructionModel The instruction model to instanciate
     * @returns The instruction instance
     */
    // public static instanciate(instruction: PipelineInstructionModel): PipelineInstruction {
    //     const instructionClass = this.resolve(instruction.instruction);
    //     return new instructionClass(instruction.args);
    // }

}