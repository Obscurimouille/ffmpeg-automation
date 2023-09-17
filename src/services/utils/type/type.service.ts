export class TypeService {

    /**
     * Check if a variable is an array of strings.
     * @param array The variable to check.
     * @returns True if the variable is an array of strings, false otherwise.
     */
    public static isStringArray(array: any): boolean {
        // Check if it's an array
        if (!Array.isArray(array)) return false;
        // Check if every element in the array is a string
        return array.every((element) => typeof element === 'string');
      }

}