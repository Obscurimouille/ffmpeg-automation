import { ParseOptions, ParserMethod } from "../classes/selectors/selector-param-parser";

type SelectorMetadata = {
    regexp: RegExp;
    parser: {
        errorMessageHeader: string;
        methods: ParserMethod[];
        options?: ParseOptions;
    }
};

export function Selector(data: SelectorMetadata) {
    return function(decoratedClass: any) {
        decoratedClass['REGEX'] = data.regexp;
        decoratedClass.prototype['REGEX'] = data.regexp;

        decoratedClass.prototype['PARSER_ERROR_MESSAGE_HEADER'] = data.parser.errorMessageHeader;
        decoratedClass.prototype['PARSER_METHODS'] = data.parser.methods;
        decoratedClass.prototype['PARSER_OPTIONS'] = data.parser.options;
    }
}