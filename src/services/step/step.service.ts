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
import { InstructionDTO } from '../../classes/dtos/models/instruction-dto';
import { InputFile } from '../../types/input-file';
import { PipelineStatement } from '../../classes/pipeline/statement/pipeline-statement';
import { StatementDTO } from '../../classes/dtos/models/statement-dto';
import { ForeachDTO } from '../../classes/pipeline/statement/foreach/foreach-model';
import { EnumArchiveFilter } from '../../enums/enum-archive-filter';
import { ArchiveService } from '../archive/archive.service';

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
                return new instructionClass(step.id, step.args, (step as InstructionDTO).archive);

            case EnumStepType.STATEMENT:
                const statementClass = StatementService.resolve(step.name);
                return new statementClass(step.id, step.args, (step as ForeachDTO).archive);

            default: throw new Error(`Unknown step type ${step.type}`);
        }
    }

    /**
     * Resolve the input of a step.
     * - The input can be a file path or a file selector (e.g. @step-1.output)
     * - The ouput can be an array of file paths or an array of step ids
     * @param input The input to resolve
     * @returns The resolved input
     */
    public static resolveInput(input: string, steps: PipelineStep[], clientId?: number): Promise<InputFile[]>[] {
        // The input is a selector
        if (SelectorService.isSelector(input)) {
            // Get the selector class
            const selectorClass = SelectorService.resolve(input);
            // Resolve the selector to get either a string or a string array
            const selector = new selectorClass(input, steps, clientId);
            // TODO: Ensure that the returned value is promises
            // Ensure the inputFile is only selector that do not return step instance
            return selector.resolve().data as Promise<InputFile[]>[];
        }

        // The input is a file path
        else {
            const path = RessourceService.INPUT_DIRECTORY + input;
            if (!fs.existsSync(path)) {
                throw new Error(`File ${path} not found`);
            }
            // Return the path as a string
            return [new Promise((resolve) => {
                resolve([path]);
            })];
        }
    }

    /**
     * Find a step in an array of steps by its id.
     * @param steps The array of steps to search in
     * @param id The id of the step to find
     * @returns The step if found, undefined otherwise
     */
    public static findStepById(steps: PipelineStep[], id: number): PipelineStep | undefined {
        // For each step in the array
        for (const step of steps) {
            // Check if the step has the id we are looking for
            if (step.id == id) return step;
            // Else check if the step has children steps
            if (step.args && step.args.steps) {
                // Recursively call this function on the children steps
                const childStep = StepService.findStepById(step.args.steps, id);
                // If the child step has been found, return it
                if (childStep) return childStep;
            }

        }
        return undefined;
    }

    /**
     * Find the parent of a step in an array, by its id.
     * @param steps The array of steps to search in
     * @param id The id of the step to find
     * @param previousParent The previous parent of the step (used for recursion)
     * @returns The step if found, undefined otherwise
     */
    public static findParent(steps: PipelineStep[], id: number, previousParent?: PipelineStatement): PipelineStatement | undefined {
        // For each step in the array
        for (const step of steps) {
            // Check if the step has the id we are looking for
            if (step.id == id) return previousParent;
            // Else check if the step has children steps
            if (step.args && step.args.steps) {
                // Recursively call this function on the children steps
                const parent = StepService.findParent(step.args.steps, id, step as PipelineStatement);
                // If the child step has been found, return the parent
                if (parent) return parent;
            }

        }
        return undefined;
    }

}
