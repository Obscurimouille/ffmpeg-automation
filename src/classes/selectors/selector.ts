import { InputFile } from "../../types/input-file";
import { PipelineStep } from "../pipeline/pipeline-step";

export type SelectorResponse = {
    type: 'step-instance' | 'content-promises';
    data: PipelineStep | (Promise<InputFile[]>[]);
}

export class PipelineSelector {

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

    protected parseParams(input: string): any {
        throw new Error('Not implemented');
    }

    public resolve(): SelectorResponse {
        throw new Error('Not implemented');
    }

    public getParams(): any {
        return this.params;
    }

}