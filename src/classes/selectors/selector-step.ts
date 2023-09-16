import { InputSelector } from "./input-selector";
import { EnumInputResolution, InputResolution } from "../../services/step/step.service";

type SelectorStepParams = {
    index: number;
    param: SelectorStepFilesParam;
};
type SelectorStepFilesParam = 'output';

export class SelectorStep extends InputSelector {

    public static override readonly REGEX: RegExp = /^@step-[0-9]+(?::|$)/;

    /**
     * Syntax :
     * - '@step-<index>:<tag>'
     * Examples :
     * - '@step-1:output'
     */

    constructor(input: string) {
        super(input);
    }

    protected override parseParams(input: string): any {
        // Check if input is valid
        if (!SelectorStep.REGEX.test(input)) throw new Error(`Invalid step selector ${input}`);

        const inputSections = input.split(':');
        if (inputSections.length != 2) throw new Error(`Invalid step selector parameters ${input}`);

        const index = Number(inputSections[0].replace('@step-', ''));
        if (isNaN(index)) throw new Error(`Invalid step index ${index}`);

        const param1 = inputSections[1];
        if (param1 != 'output') throw new Error(`Invalid step files parameter ${param1}`);

        return { index, param: param1 } as SelectorStepParams;
    }

    protected override determineOutputType(): EnumInputResolution {
        return EnumInputResolution.STEP_INDEX;
    }

    public override resolve(): InputResolution {
        // Return the step index
        return [this.params.index];
    }

}