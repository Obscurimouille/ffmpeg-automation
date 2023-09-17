import { InputSelector } from "./input-selector";
import { EnumInputResolution, InputResolution } from "../../services/step/step.service";

type SelectorStepParams = {
    targetId: number;
    param: SelectorStepFilesParam;
};
type SelectorStepFilesParam = 'output';

export class SelectorStep extends InputSelector {

    public static override readonly REGEX: RegExp = /^@step-[0-9]+(?::|$)/;

    /**
     * Syntax :
     * - '@step-<id>:<tag>'
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

        const targetId = Number(inputSections[0].replace('@step-', ''));
        if (isNaN(targetId)) throw new Error(`Invalid step id ${targetId}`);

        const param1 = inputSections[1];
        if (param1 != 'output') throw new Error(`Invalid step parameter "${param1}"`);

        return { targetId, param: param1 } as SelectorStepParams;
    }

    protected override determineOutputType(): EnumInputResolution {
        return EnumInputResolution.STEP_ID;
    }

    public override resolve(): InputResolution {
        // Return the step id
        return [this.params.targetId];
    }

}