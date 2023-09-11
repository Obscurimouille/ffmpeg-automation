import { PipelineInstruction } from "../../classes/instructions/pipeline-instruction";
import { Segment } from "../../classes/instructions/segment";
import { PipelineInstructionArgsModel, PipelineInstructionModel } from "../../types/pipeline-model";
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
     * Check if a set of arguments is valid for a given instruction.
     * @param args The arguments to check
     * @param instruction The instruction to check (class)
     */
    public static checkArgsRequirements(args: PipelineInstructionArgsModel, instruction: typeof PipelineInstruction): boolean {
        const requirements = instruction.REQUIREMENTS.arguments;
        if (!requirements) return true;

        // For each argument
        for (const [argName, argRequirements] of Object.entries(requirements)) {
            // Get the argument value
            const arg = args[argName];
            // Check if the argument is defined
            if (arg != undefined) {
                // Check if the argument is of the right type
                if (typeof arg !== argRequirements.type) return false;
            }
            // If the argument is not present it should be optional
            else if (!argRequirements.optional) return false;
        }

        // All arguments are valid
        return true;
    }

    /**
     * Create an instruction instance from an instruction model.
     * @param instructionModel The instruction model to instanciate
     * @returns The instruction instance
     */
    public static instanciate(instruction: PipelineInstructionModel): PipelineInstruction {
        const instructionClass = this.resolve(instruction.instruction);
        return new instructionClass(instruction.args);
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