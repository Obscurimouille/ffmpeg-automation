import { EnumSelectorOutputType } from "../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../types/selector";
import { PipelineStep } from "../pipeline/pipeline-step";

export abstract class PipelineSelector {

    public static REGEX: RegExp;

    protected params: any;
    protected steps: PipelineStep[];
    protected clientId?: number;

    /**
     * Create a new input selector.
     * @param input The input string
     * @param steps The pipeline steps
     * @param clientId The id of the requesting client
     */
    constructor(input: string, steps: PipelineStep[], clientId?: number) {
        this.steps = steps;
        this.clientId = clientId;
        this.params = this.parseParams(input);
    }

    /**
     * Parse the input string to extract the parameters.
     * @param input The input string
     * @returns The parameters
     */
    protected abstract parseParams(input: string): any;

    /**
     * Get the expected output type of the selector depending on parameters.
     * - Must be implemented by child classes
     * @returns The expected output type
     */
    public abstract getExpectedOutputType(): EnumSelectorOutputType;

    /**
     * Resolve the selector.
     * - Must be implemented by child classes
     * @returns The selector response
     */
    public abstract resolve(): SelectorResponse;

    public getParams(): any {
        return this.params;
    }

}