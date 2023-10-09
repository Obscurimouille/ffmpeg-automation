import { EnumComparator } from "../../enums/enum-comparator";

export enum EnumParamType {
    FILE_TYPE = 'fileType',
    EXTENSIONS = 'extensions',
    DURATION = 'matchDuration',
    REGEX = 'filenameRegexs',
};

/**
 * Compare two numbers using a comparator.
 * @param a The first number
 * @param comparator The comparator
 * @param b The second number
 * @returns Whether the comparison is true
 */
export function compare(a: number, comparator: EnumComparator, b: number): boolean {
    switch (comparator) {
        case EnumComparator.EQUAL: return a == b;
        case EnumComparator.GREATER: return a > b;
        case EnumComparator.GREATER_OR_EQUAL: return a >= b;
        case EnumComparator.LESS: return a < b;
        case EnumComparator.LESS_OR_EQUAL: return a <= b;
    }
}