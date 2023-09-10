import { PipelineInstruction } from "../../classes/instructions/pipeline-instruction";
import { Segment } from "../../classes/instructions/segment";
import { PipelineStepInstructionModel } from "../../types/pipeline-model";
import { PipelineInstructionRequirementsService } from "../pipeline-instruction-requirements/pipeline-instruction-requirements.service";

export class PipelineInstructionService {

    private static INSTRUCTIONS: Record<string, typeof PipelineInstruction> = {
        [Segment.IDENTIFIER]: Segment
    }

    /**
     * Resolve an instruction model to an instruction class.
     * @param instructionName The instruction name to resolve
     * @returns The instruction class
     */
    public static resolve(instructionName: string): typeof PipelineInstruction {

        const instructionClass = this.INSTRUCTIONS[instructionName];

        if (!instructionClass) {
            throw new Error(`Instruction ${instructionName} not found`);
        }

        return instructionClass;
    }

    /**
     * Create an instruction instance from an instruction model.
     * @param instructionModel The instruction model to instanciate
     * @returns The instruction instance
     */
    public static instanciate(instructionModel: PipelineStepInstructionModel): PipelineInstruction {
        const instructionClass = this.resolve(instructionModel.name);
        return new instructionClass(instructionModel.args);
    }

    /**
     * Check if the given instruction has all the requirements.
     * @param instruction The instruction to check
     * @param inputFiles The input files to check
     * @throws Error if the instruction does not have all the requirements
     */
    public static checkRequirements(instruction: typeof PipelineInstruction, inputFiles: string[]): void {
        const requirements = instruction.REQUIREMENTS;

        try {
            PipelineInstructionRequirementsService.checkRequirements(requirements, inputFiles);
        }
        catch (err: any) {
            throw new Error(`Instruction ${instruction.IDENTIFIER} failed requirements check: ${err.message}`);
        }
    }

}