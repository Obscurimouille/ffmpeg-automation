import { PipelineSelector } from "../selector";
import { Selector } from "../../../decorators/selector.decorator";
import { PipelineStep } from "../../pipeline/pipeline-step";
import { EnumSelectorOutputType } from "../../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../../types/selector";
import { ResourceService } from "../../../services/resources/resource.service";
import { EnumFileTypeFilter } from "../../../enums/enum-file-type-filter";
import { EnumComparator } from "../../../enums/enum-comparator";
import { ArchiveService } from "../../../services/archive/archive.service";
import { FfmpegService } from "../../../services/ffmpeg/ffmpeg.service";

enum EnumParamType {
    FILE_TYPE = 'fileType',
    EXTENSIONS = 'extensions',
    DURATION = 'matchDuration',
};

type ParamData = {
    type: EnumParamType;
    data: any;
};

type SelectorResourcesParams = {
    fileType?: EnumFileTypeFilter;
    extensions?: string[];
    matchDuration?: {
        operator: EnumComparator;
        value: number;
    }
};

@Selector({
    regexp: /^@resources+(?::|$)/
})
export class SelectorResources extends PipelineSelector {

    /**
     * Syntax :
     * - '@resources:<tag1>:<tag2>'
     * Examples :
     * - Select all files of a specific type
     *   '@resources:all' (all files)
     *   '@resources:videos' (all video files)
     *   '@resources:audios' (all audio files)
     * - Select files with specific extensions
     *  '@resources:mp4,mp3'
     * - Select files that match a duration (in seconds)
     *  '@resources:duration=10' (all files with a duration of 10 seconds)
     *  '@resources:mp4:duration>60' (mp4 files with a duration greater than 60 seconds)
     */

    public static readonly ERROR_MESSAGE_HEADER = `Invalid resources selector parameters`;

    protected override params!: SelectorResourcesParams;

    constructor(input: string, steps: PipelineStep[]) {
        super(input, steps);
    }

    protected override parseParams(input: string): SelectorResourcesParams {
        // Check if input is valid
        if (!SelectorResources.REGEX.test(input)) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + `${input}`);

        // Split the different parts (must have at least one parameter)
        const inputSections = input.split(':').filter((section) => section.length > 0);
        const nbParams = inputSections.length - 1;
        if (nbParams < 1) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` ${input}. At least one parameter is required.`);
        if (nbParams > 2) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` ${input}. Too many parameters.`);

        const params: SelectorResourcesParams = {};

        const paramData1 = SelectorResources.parseParam(inputSections[1]);
        if (!paramData1) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[1]}"`);
        params[paramData1.type] = paramData1.data;

        if (nbParams == 1) return params;

        const paramData2 = SelectorResources.parseParam(inputSections[2]);
        if (!paramData2) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[2]}"`);
        if (params[paramData2.type] != undefined) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[2]}". Parameter already defined.`);
        if (paramData2.type != EnumParamType.DURATION) {
            throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[1]}". Second parameter must define a duration.`);
        }
        params[paramData2.type] = paramData2.data;

        return params;
    }

    public static parseParam(paramContent: string): ParamData | undefined {
        // Parse the parameter type
        const fileType = SelectorResources.parseFileTypeParam(paramContent);
        if (fileType) return { type: EnumParamType.FILE_TYPE, data: fileType };

        const extensions = SelectorResources.parseExtensionsParam(paramContent);
        if (extensions) return { type: EnumParamType.EXTENSIONS, data: extensions };

        const duration = SelectorResources.parseDurationParam(paramContent);
        if (duration) return { type: EnumParamType.DURATION, data: duration };

        return undefined;
    }

    public static parseFileTypeParam(paramContent: string): EnumFileTypeFilter | undefined {
        const fileTypeRegex = /^(all|videos|audios)$/;
        const matchFileType = fileTypeRegex.exec(paramContent);
        if (!matchFileType) return undefined;
        return matchFileType[1] as EnumFileTypeFilter;
    }

    public static parseExtensionsParam(paramContent: string): string[] | undefined {
        const extensions = paramContent.split(',');
        if (extensions.length == 0) return undefined;
        for (const extension of extensions) {
            if (!ResourceService.ALL_EXTENSIONS.includes(extension)) return undefined;
        }
        return extensions;
    }

    public static parseDurationParam(paramContent: string): { operator: EnumComparator, value: number } | undefined {
        const durationRegex = /^duration(<|<=|=|>=|>)\s*(\d+)$/;
        const matchDuration = durationRegex.exec(paramContent);
        if (!matchDuration) return undefined;
        return {
            operator: matchDuration[1] as EnumComparator,
            value: parseInt(matchDuration[2])
        };
    }

    public getExpectedOutputType(): EnumSelectorOutputType {
        return EnumSelectorOutputType.CONTENT_PROMISES;
    }

    public override resolve(): SelectorResponse {
        // Return a promise that resolves to the list of input files
        const data = new Promise<string[]>(async (resolve) => {
            const files = ResourceService.getInputFiles();
            const filteredFiles = await SelectorResources.filter(files, this.params);
            resolve(filteredFiles);
        });

        return {
            type: EnumSelectorOutputType.CONTENT_PROMISES,
            data: [ data ]
        };
    }

    /**
     * Filter a list of files depending on the parameters.
     * @param files The list of files to filter
     * @param params The parameters
     * @returns The filtered list of files
     */
    public static async filter(files: string[], params: SelectorResourcesParams): Promise<string[]> {
        let filteredFiles = files;
        if (params.fileType) filteredFiles = ArchiveService.filterFiles(files, params.fileType);
        else if (params.extensions) filteredFiles = ArchiveService.filterFilesExtensions(files, params.extensions);

        if (params.matchDuration) {
            filteredFiles = await SelectorResources.filterDuration(filteredFiles, params.matchDuration.operator, params.matchDuration.value);
        }
        return filteredFiles;
    }

    /**
     * Filter a list of files depending on their duration.
     * @param files The list of files to filter
     * @param operator The comparator
     * @param value The value to compare to
     * @returns The filtered list of files
     */
    private static async filterDuration(files: string[], operator: EnumComparator, value: number): Promise<string[]> {
        let filteredFiles: string[] = [];
        for (const file of files) {
            const duration = await FfmpegService.getDuration(file);
            if (!duration) continue;
            if (SelectorResources.compare(Math.round(duration), operator, value)) {
                filteredFiles.push(file);
            }
        }
        return filteredFiles;
    }

    /**
     * Compare two numbers using a comparator.
     * @param a The first number
     * @param comparator The comparator
     * @param b The second number
     * @returns Whether the comparison is true
     */
    public static compare(a: number, comparator: EnumComparator, b: number): boolean {
        switch (comparator) {
            case EnumComparator.EQUAL: return a == b;
            case EnumComparator.GREATER: return a > b;
            case EnumComparator.GREATER_OR_EQUAL: return a >= b;
            case EnumComparator.LESS: return a < b;
            case EnumComparator.LESS_OR_EQUAL: return a <= b;
        }
    }

}