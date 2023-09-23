import { EnumSelectorOutputType } from "../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../types/selector";
import { PipelineStep } from "../pipeline/pipeline-step";
import { ParseOptions, ParserMethod, SelectorParamParser } from "./selector-param-parser";

export abstract class PipelineSelector {

    public static readonly REGEX: RegExp;

    protected readonly REGEX!: RegExp;
    protected readonly PARSER_ERROR_MESSAGE_HEADER!: string;
    protected readonly PARSER_METHODS!: ParserMethod[];
    protected readonly PARSER_OPTIONS!: ParseOptions;

    protected input: string;
    protected steps: PipelineStep[];
    protected clientId?: number;
    protected params: any;

    /**
     * Create a new input selector.
     * @param input The input string
     * @param steps The pipeline steps
     * @param clientId The id of the requesting client
     */
    constructor(input: string, steps: PipelineStep[], clientId?: number) {
        this.input = input;
        this.steps = steps;
        this.clientId = clientId;
    }

    public init(): void {
        this.params = this.parseParams(this.input);
    }

    /**
     * Parse the input string to extract the parameters.
     * @param input The input string
     * @returns The parameters
     */
    protected parseParams(input: string): any {
         // Check if input is valid
         if (!this.REGEX.test(input)) {
            throw new Error(this.PARSER_ERROR_MESSAGE_HEADER + `${input}`);
        }

        const parser = new SelectorParamParser(input);
        parser.addParseMethods(
            this.PARSER_METHODS
        );

        const params = parser.run(error => {
            throw new Error(this.PARSER_ERROR_MESSAGE_HEADER + ` ${error}`);
        },
        this.PARSER_OPTIONS)!;

        return params;
    }

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