import { PipelineSelector } from "../selector";
import { Selector } from "../../../decorators/selector.decorator";
import { PipelineStep } from "../../pipeline/pipeline-step";
import { EnumSelectorOutputType } from "../../../enums/enum-selector-output-type";
import { SelectorResponse } from "../../../types/selector";
import { ResourceService } from "../../../services/resources/resource.service";
import { EnumFileTypeFilter } from "../../../enums/enum-file-type-filter";
import { EnumComparator } from "../../../enums/enum-comparator";
import { parseDurationParam, parseExtensionsParam, parseFileTypeParam, parseFilenameRegexParam } from "../../../modules/selector-parser/parse";
import { filter } from "../../../modules/selector-parser/filter";

type SelectorResourcesParams = {
    fileType?: EnumFileTypeFilter;
    extensions?: string[];
    matchDuration?: {
        operator: EnumComparator;
        value: number;
    },
    filenameRegexs?: RegExp[];
};

@Selector({
    regexp: /^@resources+(?::|$)/,
    parser: {
        errorMessageHeader: `Invalid resources selector parameters`,
        methods: [
            parseFileTypeParam,
            parseExtensionsParam,
            parseDurationParam,
            parseFilenameRegexParam
        ],
        options: {
            minParams: 1
        }
    }
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
     * - Specify filename syntax
     *  '@resources:startwith=foo' (all files that start with 'foo': foo.ext, foo-bar.ext, foo-bar-baz.ext, ...)
     *  '@resources:endwith=bar' (all files that end with 'bar': bar.ext, foo-bar.ext, ...)
     *  '@resources:contains=bar' (all files that contain 'bar': bar.ext, foo-bar.ext, foo-bar-baz.ext, ...)
     */

    protected override params!: SelectorResourcesParams;

    constructor(input: string, steps: PipelineStep[]) {
        super(input, steps);
    }

    public getExpectedOutputType(): EnumSelectorOutputType {
        return EnumSelectorOutputType.CONTENT_PROMISES;
    }

    public override resolve(): SelectorResponse {
        // Return a promise that resolves to the list of input files
        const data = new Promise<string[]>(async (resolve) => {
            const files = ResourceService.getInputFiles();
            const filteredFiles = await filter(files, this.params);
            resolve(filteredFiles);
        });

        return {
            type: EnumSelectorOutputType.CONTENT_PROMISES,
            data: [ data ]
        };
    }

}