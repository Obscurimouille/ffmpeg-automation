import { InputSelector } from "../../classes/selectors/input-selector";
import { SelectorStep } from "../../classes/selectors/selector-step";

export class SelectorService {

    private static AVAILABLE_SELECTORS: typeof InputSelector[] = [
        SelectorStep
    ];

    /**
     * Resolve the input to a selector
     * @param input The input to resolve
     * @returns The selector class
     */
    public static resolve(input: string): typeof InputSelector {
        const selectorClass = this.AVAILABLE_SELECTORS.find((selector) => selector.REGEX.test(input));

        if (!selectorClass) {
            throw new Error(`No selector found for ${input}`);
        }

        return selectorClass;
    }

    /**
     * Check if the input is a valid selector
     * @param input The input to check
     * @returns True if the input is a valid selector, false otherwise
     */
    public static isSelector(input: string): boolean {
        return this.AVAILABLE_SELECTORS.some((selector) => selector.REGEX.test(input));
    }

}