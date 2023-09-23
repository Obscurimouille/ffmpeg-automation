export type ParseOptions = {
    minParams?: number;
    maxParams?: number;
    includeName?: boolean;
};

type ParseErrorCallback = (message: string) => void;

export type ParserMethod = (rawParam: string) => ParamData | undefined;

export type ParamData = {
    key: string;
    isArray?: boolean;
    data: any;
} | undefined;

export class SelectorParamParser {

    private input: string;
    private parseMethods: ParserMethod[] = [];

    constructor(input: string) {
        this.input = input;
    }

    public addParseMethods(methods: ParserMethod[]): void {
        this.parseMethods.push(...methods);
    }

    public run(error?: ParseErrorCallback, options?: ParseOptions): any {
        try {
            const elements = this.input.split(':').filter((section) => section.length > 0);
            elements[0] = elements[0].replace('@', '');

            const selector = elements[0];
            const params = elements.slice(options?.includeName ? 0 : 1);
            const nbParams = params.length - (options?.includeName ? 1 : 0);

            if (options?.minParams && nbParams < options.minParams) {
                if (error) error(`Selector ${selector} expects at least ${options.minParams} parameters`);
                return undefined;
            }

            if (options?.maxParams && nbParams > options.maxParams) {
                if (error) error(`Selector ${selector} expects at most ${options.maxParams} parameters`);
                return undefined;
            }

            const returnParams: { [key: string]: any } = {};
            for (let i = 0; i < params.length; i++) {
                const rawParam = params[i];

                let paramData: ParamData = undefined;
                for (const parseMethod of this.parseMethods) {
                    const data = parseMethod(rawParam);
                    if (data) {
                        paramData = data;
                        break;
                    }
                }

                // Check if the parameter is valid
                if (!paramData) {
                    if (error) error(`Parameter ${rawParam} is not valid`);
                    return undefined;
                }

                // Check if the parameter has already been specified
                if (!paramData.isArray && returnParams[paramData.key]) {
                    if (error) error(`Parameter ${paramData.key} can only be specified once`);
                    return undefined;
                }

                if (paramData.isArray) {
                    if (!returnParams[paramData.key]) returnParams[paramData.key] = [paramData.data];
                    else (returnParams[paramData.key] as Array<any>).push(paramData.data);
                }
                else returnParams[paramData.key] = paramData.data;
            }
            return returnParams;
        }
        catch (e: any) {
            if (error) error(e.message);
            return undefined;
        }
    }

}