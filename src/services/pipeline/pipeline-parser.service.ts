export class PipelineParserService {

    private static instance: PipelineParserService;

    private validateIds: number[] = [];

    constructor() {}

    public static getInstance(): PipelineParserService {
        if (!PipelineParserService.instance) {
            PipelineParserService.instance = new PipelineParserService();
        }
        return PipelineParserService.instance;
    }

    /**
     * Get the list of ids to validate.
     * @returns The list of ids to validate.
     */
    public getValidateIds(): number[] {
        return this.validateIds;
    }

    /**
     * Add an id to the list of ids to validate.
     * @param id The id to add.
     */
    public addValidateId(id: number): void {
        this.validateIds.push(id);
    }

    /**
     * Check if the id is already used.
     * @param id The id to check.
     * @returns True if the id is already used, false otherwise.
     */
    public isIdAlreadyUsed(id: number): boolean {
        return this.validateIds.includes(id);
    }

    /**
     * Reset the list of ids to validate.
     */
    public resetValidatedIds(): void {
        this.validateIds = [];
    }

}