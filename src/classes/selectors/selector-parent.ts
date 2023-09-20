import { PipelineSelector } from "./selector";
import { Selector } from "../../decorators/selector.decorator";
import { PipelineStep } from "../pipeline/pipeline-step";
import { InputFile } from "../../types/input-file";
import { StepService } from "../../services/step/step.service";
import { EnumSelectorOutputType } from "../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../types/selector";

type SelectorParentParams = {
    param: 'item' | undefined;
};

@Selector({
    regexp: /^@parent+(?::|$)/
})
export class SelectorParent extends PipelineSelector {

    /**
     * Syntax :
     * - '@parent:<tag>'
     * Examples :
     * - Select the parent step
     *   '@parent'
     * - Select the current element of a parent loop
     *   '@parent:element'
     */

    constructor(input: string, steps: PipelineStep[], clientId: number) {
        super(input, steps, clientId);
    }

    protected override parseParams(input: string): SelectorParentParams {
        // Check if input is valid
        if (!SelectorParent.REGEX.test(input)) throw new Error(`Invalid parent selector ${input}`);

        // Split the different parts
        const inputSections = input.split(':');
        if (inputSections.length > 2) throw new Error(`Invalid parent selector parameters ${input}`);

        // Parse the parameter
        const param = inputSections.length == 2 ? inputSections[1] : undefined;
        if (param && param != 'item') {
            throw new Error(`Invalid parent selector parameter "${param}"`);
        }

        return { param } as SelectorParentParams;
    }

    public getExpectedOutputType(): EnumSelectorOutputType {
        if (this.params.param) return EnumSelectorOutputType.CONTENT_PROMISES;
        return EnumSelectorOutputType.STEP_INSTANCE;
    }

    public override resolve(): SelectorResponse {
        // Find the step associated with the step id
        const parent = StepService.findParent(this.steps, this.clientId!);

        if (!parent) {
            throw new Error(`Could not find parent for step ${this.clientId}`);
        }

        // If no parameter is specified, return the parent instance
        if (!this.params.param) return {
            type: EnumSelectorOutputType.STEP_INSTANCE,
            data: parent
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