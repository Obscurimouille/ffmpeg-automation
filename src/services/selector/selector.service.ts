import { ClassConstructor } from "class-transformer";
import { PipelineSelector } from "../../classes/selectors/selector";
import { SELECTORS } from "../../declaration";
import { EnumComparator } from "../../enums/enum-comparator";

export class SelectorService {

    /**
     * Resolve the input to a selector
     * @param input The input to resolve
     * @returns The selector class
     */
    public static resolve(input: string): ClassConstructor<PipelineSelector> {
        const selectorClass = SELECTORS.find((selector: ClassConstructor<PipelineSelector>) => (selector as any).REGEX.test(input));
        if (!selectorClass) throw new Error(`No selector found for ${input}`);
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

    /**
     * Compare two numbers using a comparator.
     * @param a The first number
     * @param comparator The comparator
     * @param b The second number
     * @returns Whether the comparison is true
     */
    public static compare(a: number, comparator: EnumComparator, b: number): boolean {
        switch (comparator) {
            case EnumComparator.EQUAL: return a == b;
            case EnumComparator.GREATER: return a > b;
            case EnumComparator.GREATER_OR_EQUAL: return a >= b;
            case EnumComparator.LESS: return a < b;
            case EnumComparator.LESS_OR_EQUAL: return a <= b;
        }
    }

}