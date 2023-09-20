import { PipelineSelector, SelectorResponse } from "./selector";
import { StepService } from "../../services/step/step.service";
import { Selector } from "../../decorators/selector.decorator";
import { PipelineStep } from "../pipeline/pipeline-step";
import { InputFile } from "../../types/input-file";

type SelectorStepParams = {
    targetId: number;
    param: SelectorStepFilesParam;
};
type SelectorStepFilesParam = 'output';

@Selector({
    regexp: /^@step-[0-9]+(?::|$)/
})
export class SelectorStep extends PipelineSelector {

    /**
     * Syntax :
     * - '@step-<id>:<tag>'
     * Examples :
     * - Select the output of the step 1
     *   '@step-1:output'
     */

    constructor(input: string, steps: PipelineStep[]) {
        super(input, steps);
    }

    protected override parseParams(input: string): any {
        // Check if input is valid
        if (!SelectorStep.REGEX.test(input)) throw new Error(`Invalid step selector ${input}`);

        // Split the different parts
        const inputSections = input.split(':');
        if (inputSections.length > 2) throw new Error(`Invalid step selector parameters ${input}`);

        // Parse the step id
        const targetId = Number(inputSections[0].replace('@step-', ''));
        if (isNaN(targetId)) throw new Error(`Invalid step id ${targetId}`);

        // Parse the step parameter (if any)
        const param = inputSections.length == 2 ? inputSections[1] : undefined;
        if (param && param != 'output') {
            throw new Error(`Invalid step parameter "${param}"`);
        }

        return { targetId, param } as SelectorStepParams;
    }

    public override resolve(): SelectorResponse {
        // Find the step associated with the step id
        const associatedStep = StepService.findStepById(this.steps, this.params.targetId);

        if (!associatedStep) {
            throw new Error(`Could not find step ${this.params.targetId}`);
        }

        // If no parameter is specified, return the step instance
        if (!this.params.param) return {
            type: 'step-instance',
            data: associatedStep
        };

        // If the parameter is 'output', return the step outputs
        return {
            type: 'content-promises',
            data: [
                new Promise<InputFile[]>((resolve) => {
                    associatedStep.processEnded.subscribe((outputs) => {
                        resolve(outputs);
                    });
                }
            )]
        };
    }

}