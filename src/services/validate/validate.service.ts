export class ValidateService {

    /**
     * Try to pass the given function.
     * @param fn The function to try
     * @returns True if the function passed, false otherwise
     */
    public static tryPass(fn: () => any): boolean {
        try {
            fn();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if the given value is part of the given enum.
     * @param value The value to check
     * @param enumType The enum to check
     * @returns True if the value is part of the enum, false otherwise
     */
    public static isPartOfEnum<T>(value: any, enumType: T): boolean {
        if (typeof enumType === 'object' && enumType !== null) {
            // Check if enumType is an object (an enum) and not null
            return Object.values(enumType as Record<string, any>).includes(value);
        }
        return false;
    }

}