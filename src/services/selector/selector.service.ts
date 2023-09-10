import { InputSelector } from "../../classes/selectors/input-selector";
import { SelectorStep } from "../../classes/selectors/selector-step";

export class SelectorService {

    private static AVAILABLE_SELECTORS: typeof InputSelector[] = [
        SelectorStep
    ];

    public static resolve(input: string): typeof InputSelector {
        const selectorClass = this.AVAILABLE_SELECTORS.find((selector) => selector.REGEX.test(input));

        if (!selectorClass) {
            throw new Error(`No selector found for ${input}`);
        }

        return selectorClass;
    }

}