import { EnumInputResolution, InputResolution } from "../../services/step/step.service";

/**
 * Abstract class for all pipeline step instructions.
 */
export class InputSelector {

    public static REGEX: RegExp;

    protected params: any;
    protected outputType: EnumInputResolution;

    constructor(input: string) {
        this.params = this.parseParams(input);
        this.outputType = this.determineOutputType();
    }

    protected parseParams(input: string): any {
        throw new Error('Not implemented');
    }

    protected determineOutputType(): EnumInputResolution {
        throw new Error('Not implemented');
    }

    public resolve(): InputResolution {
        throw new Error('Not implemented');
    }

    public getOutputType(): EnumInputResolution {
        return this.outputType!;
    }

    public getParams(): any {
        return this.params;
    }

}