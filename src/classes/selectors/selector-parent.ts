import { PipelineSelector, SelectorResponse } from "./selector";
import { Selector } from "../../decorators/selector.decorator";
import { PipelineStep } from "../pipeline/pipeline-step";
import { InputFile } from "../../types/input-file";
import { StepService } from "../../services/step/step.service";

type SelectorParentParams = {
    param: SelectorParentFilesParam;
};
type SelectorParentFilesParam = 'item';

@Selector({
    regexp: /^@parent+(?::|$)/
})
export class SelectorParent extends PipelineSelector {

    /**
     * Syntax :
     * - '@parent:<tag>'
     * Examples :
     * - Select the current element of a parent loop
     *   '@parent:element'
     */

    constructor(input: string, steps: PipelineStep[], clientId: number) {
        super(input, steps, clientId);
    }

    protected override parseParams(input: string): any {
        console.log(`\n- SELECTOR for ${this.clientId} parse params...`);
        console.log(`- input ${input}\n`);
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

    public override resolve(): SelectorResponse {
        console.log(`\n- SELECTOR for ${this.clientId} resolve...`);
        console.log(this.params);
        console.log('\n');
        // Find the step associated with the step id
        const parent = StepService.findParent(this.steps, this.clientId!);

        if (!parent) {
            throw new Error(`Could not find parent for step ${this.clientId}`);
        }

        // If no parameter is specified, return the parent instance
        if (!this.params.param) return {
            type: 'step-instance',
            data: parent
        };

        // If the parameter is 'item', return step current item
        return {
            type: 'content-promises',
            data: [
                new Promise<InputFile[]>((resolve) => {
                    resolve([parent.currentItem]);
                })
            ]
        };
    }

}