export class PipelineParserService {

    private static validateIds: number[] = [];

    /**
     * Get the list of ids to validate.
     * @returns The list of ids to validate.
     */
    public static getValidateIds(): number[] {
        return PipelineParserService.validateIds;
    }

    /**
     * Add an id to the list of ids to validate.
     * @param id The id to add.
     */
    public static addValidateId(id: number): void {
        PipelineParserService.validateIds.push(id);
    }

    /**
     * Check if the id is already used.
     * @param id The id to check.
     * @returns True if the id is already used, false otherwise.
     */
    public static isIdAlreadyUsed(id: number): boolean {
        return PipelineParserService.validateIds.includes(id);
    }

    /**
     * Reset the list of ids to validate.
     */
    public static resetValidatedIds(): void {
        PipelineParserService.validateIds = [];
    }

}