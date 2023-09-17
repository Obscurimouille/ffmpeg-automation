import { StepDTO } from '../../classes/dtos/models/step-dto';
import { logger } from '../../logger';
import { PipelineStep } from '../../classes/pipeline/pipeline-step';
import { EnumStepType } from '../../enums/enum-step-type';
import { InstructionService } from '../instruction/instruction.service';
import { RessourceService } from '../ressources/ressource.service';
import { SelectorService } from '../selector/selector.service';
import { StatementService } from '../statement/statement.service';
import { FileService } from '../utils/file/file.service';
import fs from 'fs';

export enum EnumInputResolution {
    STRING,
    STEP_ID,
}
export type StepId = number;
export type InputResolution = string[] | StepId[];

export class StepService {

    public static moveInputFilesToWorkspace(inputs: string[], workspaceDir: string): string[] {
        return FileService.relocateFiles(inputs, workspaceDir + 'input/');
    }

    /**
     * Instanciate steps from step models.
     * @param stepsDTO The step models to instanciate
     * @returns The step instances (instructions or/and statements)
     */
    public static instanciateSteps(stepsDTO: StepDTO[]): PipelineStep[] {
        let steps = [];
        for (const dto of stepsDTO) {
            steps.push(StepService.instanciateStep(dto));
        }
        return steps;
    }

    /**
     * Instanciate a step from a step model.
     * @param step The step model to instanciate
     * @returns The step instance (instruction or statement)
     */
    public static instanciateStep(step: StepDTO): PipelineStep {
        switch (step.type) {
            case EnumStepType.INSTRUCTION:
                const instructionClass = InstructionService.resolve(step.name);
                return new instructionClass(step.id, step.args);

            case EnumStepType.STATEMENT:
                const statementClass = StatementService.resolve(step.name);
                return new statementClass(step.id, step.args);

            default: throw new Error(`Unknown step type ${step.type}`);
        }
    }

    /**
     * Resolve the input of a step.
     * - The input wan be a file path or a file selector (e.g. @step-1.output)
     * - The ouput can be an array of file paths or an array of step ids
     * @param input The input to resolve
     * @returns The resolved input
     */
    public static resolveInput(input: string): InputResolution {
        // The input is a selector
        if (input.includes('@')) {
            // Get the selector class
            let selectorClass;
            try {
                selectorClass = SelectorService.resolve(input);
            } catch (error: any) {
                logger.error('Error:', error.message);
                process.exit(1);
            }

            // Resolve the selector to get either a string or a string array
            const selector = new selectorClass(input);
            return selector.resolve();
        }

        // The input is a file path
        else {
            const path = RessourceService.INPUT_DIRECTORY + input;
            if (!fs.existsSync(path)) {
                throw new Error(`File ${path} not found`);
            }
            // Return the path as a string
            return [path];
        }
    }

    /**
     * Find a step in an array of steps by its id.
     * @param steps The array of steps to search in
     * @param id The id of the step to find
     * @returns The step if found, null otherwise
     */
    public static findStepById(steps: PipelineStep[], id: number): PipelineStep | null {
        for (const step of steps) {
            if (step.id == id) {
                return step;
            }
        }
        return null;
    }

}
