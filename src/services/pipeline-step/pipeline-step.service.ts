import { PipelineStep } from "../../classes/pipeline-step";
import { RessourceService } from "../ressources/ressource.service";
import { SelectorService } from "../selector/selector.service";
import { FileService } from "../utils/file/file.service";
import fs from 'fs';

export enum EnumInputResolution {
    STRING,
    STEP_INDEX,
};
export type StepIndex = number;
export type InputResolution = string[] | StepIndex[];

export class PipelineStepService {

    public static moveInputFilesToWorkspace(inputs: string[], workspaceDir: string): string[] {
        return FileService.relocateFiles(inputs, workspaceDir + 'input/');
    }

    /**
     * Resolve the input of a step.
     * - The input wan be a file path or a file selector (e.g. @step-1.output)
     * - The ouput can be an array of file paths or an array of step indexes
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
            }
            catch (error: any) {
                console.error("Error:", error.message);
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
     * Find a step in an array of steps by its index.
     * @param stepArray The array of steps to search in
     * @param index The index of the step to find
     * @returns The step if found, null otherwise
     */
    public static findStepById(stepArray: PipelineStep[], id: number): PipelineStep | null {
        for (const step of stepArray) {
            if (step.id == id) {
                return step;
            }
        }
        return null;
    }

}