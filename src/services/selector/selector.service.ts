import { PipelineSelector } from "../../classes/selectors/selector";
import { SELECTORS } from "../../declaration";

export class SelectorService {

    /**
     * Resolve the input to a selector
     * @param input The input to resolve
     * @returns The selector class
     */
    public static resolve(input: string): typeof PipelineSelector {
        const selectorClass = SELECTORS.find((selector) => selector.REGEX.test(input));

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
        try {
            this.resolve(input);
        }
        catch (e) {
            return false;
        }
        return true;
    }

}