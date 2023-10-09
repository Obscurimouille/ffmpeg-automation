import { PipelineSelector } from "../selector";
import { StepService } from "../../../services/step/step.service";
import { Selector } from "../../../decorators/selector.decorator";
import { PipelineStep } from "../../pipeline/pipeline-step";
import { InputFile } from "../../../types/input-file";
import { EnumSelectorOutputType } from "../../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../../types/selector";
import { parseStepElementParam, parseStepIdParam } from "../../../modules/selector-parser/parse";

type SelectorStepParams = {
    targetId: number;
    targetElement: 'output' | undefined;
};

@Selector({
    regexp: /^@step-[0-9]+(?::|$)/,
    parser: {
        errorMessageHeader: `Invalid step selector parameters`,
        methods: [
            parseStepIdParam,
            parseStepElementParam
        ],
        options: {
            includeName: true,
            maxParams: 1
        }
    }
})
export class SelectorStep extends PipelineSelector {

    /**
     * Syntax :
     * - '@step-<id>:<tag>'
     * Examples :
     * - Select the step instance
     *   '@step-1'
     * - Select the output of the step 1
     *   '@step-1:output'
     */

    protected override params!: SelectorStepParams;

    constructor(input: string, steps: PipelineStep[]) {
        super(input, steps);
    }

    public getExpectedOutputType(): EnumSelectorOutputType {
        if (this.params.targetElement) return EnumSelectorOutputType.CONTENT_PROMISES;
        return EnumSelectorOutputType.STEP_INSTANCE;
    }

    public override resolve(): SelectorResponse {
        // Find the step associated with the step id
        const associatedStep = StepService.findStepById(this.steps, this.params.targetId);

        if (!associatedStep) {
            throw new Error(`Could not find step ${this.params.targetId}`);
        }

        // If no parameter is specified, return the step instance
        if (!this.params.targetElement) return {
            type: EnumSelectorOutputType.STEP_INSTANCE,
            data: new Promise<PipelineStep>((resolve) => {
                resolve(associatedStep);
            })
        };

        // If the parameter is 'output', return the step outputs
        return {
            type: EnumSelectorOutputType.CONTENT_PROMISES,
            data: [
                new Promise<InputFile[]>((resolve) => {
                    associatedStep.endedSubject.subscribe((outputs) => {
                        resolve(outputs);
                    });
                }
            )]
        };
    }

}