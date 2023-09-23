import { PipelineSelector } from "../selector";
import { Selector } from "../../../decorators/selector.decorator";
import { PipelineStep } from "../../pipeline/pipeline-step";
import { InputFile } from "../../../types/input-file";
import { StepService } from "../../../services/step/step.service";
import { EnumSelectorOutputType } from "../../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../../types/selector";
import { parseParentElementParam } from "../../../utils/selector-parser/parse";

type SelectorParentParams = {
    targetElement: 'item' | undefined;
};

@Selector({
    regexp: /^@parent+(?::|$)/,
    parser: {
        errorMessageHeader: `Invalid parent selector parameters`,
        methods: [
            parseParentElementParam
        ]
    }
})
export class SelectorParent extends PipelineSelector {

    /**
     * Syntax :
     * - '@parent:<tag>'
     * Examples :
     * - Select the parent step
     *   '@parent'
     * - Select the current item of a parent loop
     *   '@parent:item'
     */

    protected override params!: SelectorParentParams;

    constructor(input: string, steps: PipelineStep[], clientId: number) {
        super(input, steps, clientId);
    }

    public getExpectedOutputType(): EnumSelectorOutputType {
        if (this.params.targetElement) return EnumSelectorOutputType.CONTENT_PROMISES;
        return EnumSelectorOutputType.STEP_INSTANCE;
    }

    public override resolve(): SelectorResponse {
        // Find the step associated with the step id
        const parent = StepService.findParent(this.steps, this.clientId!);

        if (!parent) {
            throw new Error(`Could not find parent for step ${this.clientId}`);
        }

        // If no parameter is specified, return the parent instance
        if (!this.params.targetElement) return {
            type: EnumSelectorOutputType.STEP_INSTANCE,
            data: new Promise<PipelineStep>((resolve) => {
                resolve(parent);
            })
        };

        // If the parameter is 'item', return step current item
        return {
            type: EnumSelectorOutputType.CONTENT_PROMISES,
            data: [
                new Promise<InputFile[]>((resolve) => {
                    resolve([parent.currentItem]);
                })
            ]
        };
    }

}