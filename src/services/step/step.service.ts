import { StepDTO } from '../../classes/dtos/models/step-dto';
import { PipelineStep } from '../../classes/pipeline/pipeline-step';
import { EnumStepType } from '../../enums/enum-step-type';
import { InstructionService } from './instruction.service';
import { ResourceService } from '../resources/resource.service';
import { SelectorService } from '../selector/selector.service';
import { StatementService } from './statement.service';
import { FileService } from '../utils/file/file.service';
import { InstructionDTO } from '../../classes/dtos/models/instruction-dto';
import { InputFile } from '../../types/input-file';
import { PipelineStatement } from '../../classes/pipeline/statement/pipeline-statement';
import { ForeachDTO } from '../../classes/pipeline/statement/foreach/foreach-model';
import { EnumStepStatus } from '../../enums/enum-step-status';
import { EnumSelectorOutputType } from '../../enums/enum-selector-output-type';
import { Foreach } from '../../classes/pipeline/statement/foreach/foreach';
import path from "path";
import fs from 'fs';

export class StepService {

    public static moveInputFilesToWorkspace(inputs: string[], workspaceDir: string): string[] {
        return FileService.relocateFiles(inputs, path.join(workspaceDir, 'input'));
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
     * - The input can be a file path or a file selector (e.g. @step-1:output)
     *   - Selector can only refer to content promises (e.g. @step-1:output, not @step-1 wich refers to the step instance)
     * - The ouput is an array of promise that resolves to a string array
     * @param input The input to resolve
     * @param steps The steps of the pipeline (used for step selector)
     * @param clientId The client id (used for step selector)
     * @returns The resolved input
     */
    public static resolveInput(input: string, steps: PipelineStep[], clientId?: number): Promise<InputFile[]>[] {
        // The input is a selector
        if (SelectorService.isSelector(input)) {
            // Get the selector class
            const selectorClass = SelectorService.resolve(input);
            // Resolve the selector to get either a string or a string array
            const selector = new selectorClass(input, steps, clientId);
            selector.init();
            if (selector.getExpectedOutputType() != EnumSelectorOutputType.CONTENT_PROMISES) {
                throw new Error(`Selector ${input} is incompatible with step input`);
            }
            // Ensure the inputFile is only selector that do not return step instance
            return selector.resolve().data as Promise<InputFile[]>[];
        }

        // The input is a file path
        else {
            const filepath = path.join(ResourceService.INPUT_DIRECTORY, input);
            if (!fs.existsSync(filepath)) {
                throw new Error(`File ${filepath} not found`);
            }
            // Return the path as a string
            return [new Promise((resolve) => {
                resolve([filepath]);
            })];
        }
    }

    /**
     * Find a step by its id in an array of steps.
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
            if (step instanceof Foreach && step.steps) {
                // Recursively call this function on the children steps
                const childStep = StepService.findStepById(step.steps, id);
                // If the child step has been found, return it
                if (childStep) return childStep;
            }
        }
        return undefined;
    }

    /**
     * Find the parent of a step in an array.
     * - The parent is the step that contains the step in its children steps
     * - The step is located via its id
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
            if (step instanceof Foreach && step.steps) {
                // Recursively call this function on the children steps
                const parent = StepService.findParent(step.steps, id, step as PipelineStatement);
                // If the child step has been found, return the parent
                if (parent) return parent;
            }
        }
        return undefined;
    }

    /**
     * Wait for a list of steps to end.
     * @param steps The steps to wait for
     * @returns A promise that resolves when all the steps have ended
     */
    public static async waitForSteps(steps: PipelineStep[]): Promise<void> {
        const promises = [];
        for (const step of steps) {
            promises.push(step.waitForStatus(EnumStepStatus.ENDED));
        }
        await Promise.all(promises);
    }

    /**
     * Initialize a list of steps.
     * An additional array of steps is given in case the step needs reference
     * @param steps The steps to run init() on
     * @param pipelineSteps The pipeline steps (used for step selector)
     */
    public static initSteps(steps: PipelineStep[], pipelineSteps?: PipelineStep[]): void {
        for (const step of steps) {
            step.init(pipelineSteps || steps);
        }
    }

    /**
     * Run a list of steps.
     * @param steps The steps to run
     */
    public static runSteps(steps: PipelineStep[]): void {
        for (const step of steps) {
            step.run();
        }
    }

}
