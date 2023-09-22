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
import { SelectorService } from "../../../services/selector/selector.service";

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
        if (inputSections.length < 2) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` ${input}. At least one parameter is required.`);
        if (inputSections.length > 3) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` ${input}. Too many parameters.`);

        const params: SelectorResourcesParams = {};

        const paramData1 = SelectorResources.parseParam(inputSections[1]);
        if (!paramData1) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[1]}"`);
        if (paramData1.type != EnumParamType.FILE_TYPE && (paramData1.type != EnumParamType.EXTENSIONS)) {
            throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[1]}". First parameter must define a file type or extensions.`);
        }
        params[paramData1.type] = paramData1.data;

        if (inputSections.length == 2) return params;

        const paramData2 = SelectorResources.parseParam(inputSections[2]);
        if (!paramData2) throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[2]}"`);
        if (paramData2.type != EnumParamType.DURATION) {
            throw new Error(SelectorResources.ERROR_MESSAGE_HEADER + ` "${inputSections[1]}". Second parameter must define a duration.`);
        }
        params[paramData1.type] = paramData1.data;

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

    public static parseFileTypeParam(paramContent: string): 'all' | 'videos' | 'audios' | undefined {
        const fileTypeRegex = /^(all|videos|audios)$/;
        const matchFileType = fileTypeRegex.exec(paramContent);
        if (!matchFileType) return undefined;
        return matchFileType[1] as 'all' | 'videos' | 'audios';
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

        // Filter the input files
        let files = ResourceService.getInputFiles();
        if (this.params.fileType) files = ArchiveService.filterFiles(files, this.params.fileType);
        else if (this.params.extensions) files = ArchiveService.filterFilesExtensions(files, this.params.extensions);

        // TODO: Duration filter - async :(
        // if (this.params.matchDuration) {
        //     files = SelectorResources.filterDuration(files, this.params.matchDuration.operator, this.params.matchDuration.value);
        // }
        // ---------------

        return {
            type: EnumSelectorOutputType.CONTENT_PROMISES,
            data: [
                new Promise<string[]>((resolve) => {
                    resolve(files);
                }
            )]
        };
    }

    private static async filterDuration(files: string[], operator: EnumComparator, value: number): Promise<string[]> {
        return files.filter(async (file) => {
            const duration = await FfmpegService.getDuration(file);
            if (!duration) return false;
            return SelectorService.compare(Math.round(duration), operator, value);
        });
    }

}