export class TypeService {

    /**
     * Check if a variable is an array of strings.
     */
    public static isStringArray(array: any): boolean {
        // Check if it's an array
        if (!Array.isArray(array)) return false;
        // Check if every element in the array is a string
        return array.every((element) => typeof element === 'string');
      }

}