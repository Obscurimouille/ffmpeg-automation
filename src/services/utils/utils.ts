export class UtilsService {

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

}