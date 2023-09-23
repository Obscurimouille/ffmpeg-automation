import { ParamData } from "../../classes/selectors/selector-param-parser";
import { EnumComparator } from "../../enums/enum-comparator";
import { EnumFileTypeFilter } from "../../enums/enum-file-type-filter";
import { ResourceService } from "../../services/resources/resource.service";
import { EnumParamType } from "./utils";

export function parseFileTypeParam(paramContent: string): ParamData | undefined {
    const fileTypeRegex = /^(all|videos|audios)$/;
    const match = fileTypeRegex.exec(paramContent);
    if (!match) return undefined;
    return {
        key: EnumParamType.FILE_TYPE,
        data: match[1] as EnumFileTypeFilter
    };
}

export function parseExtensionsParam(paramContent: string): ParamData | undefined {
    const extensions = paramContent.split(',');
    if (extensions.length == 0) return undefined;
    for (const extension of extensions) {
        if (!ResourceService.ALL_EXTENSIONS.includes(extension)) return undefined;
    }
    return {
        key: EnumParamType.EXTENSIONS,
        data: extensions
    };
}

export function parseDurationParam(paramContent: string): ParamData | undefined {
    const durationRegex = /^duration(<|<=|=|>=|>)\s*(\d+)$/;
    const match = durationRegex.exec(paramContent);
    if (!match) return undefined;
    return {
        key: EnumParamType.DURATION,
        data: {
            operator: match[1] as EnumComparator,
            value: parseInt(match[2])
        }
    };
}

export function parseFilenameRegexParam(paramContent: string): ParamData | undefined {
    const regexPattern = /(startwith|endwith|contains)=([\w\d-]+)/;
    const match = regexPattern.exec(paramContent);
    if (!match) return undefined;
    const keyword = match[1];
    const value = match[2];
    let customRegex;
    switch (keyword) {
        case 'startwith':
            customRegex = new RegExp(`^${value}`);
            break;
        case 'endwith':
            customRegex = new RegExp(`${value}$`);
            break;
        case 'contains':
            customRegex = new RegExp(value);
            break;
        default: return undefined;
    }
    return {
        key: EnumParamType.REGEX,
        isArray: true,
        data: customRegex
    }
}

export function parseParentElementParam(paramContent: string): ParamData | undefined {
    if (paramContent != 'item') return undefined;
    return {
        key: 'targetElement',
        data: paramContent
    };
}

export function parseStepIdParam(paramContent: string): ParamData | undefined {
    const regex = /step-(\d+)/;
    const match = regex.exec(paramContent);
    if (!match) return undefined;
    return {
        key: 'targetId',
        data: Number(match[1])
    };
}

export function parseStepElementParam(paramContent: string): ParamData | undefined {
    if (paramContent != 'output') return undefined;
    return {
        key: 'targetElement',
        data: paramContent
    };
}