import { PipelineStep } from "../classes/pipeline/pipeline-step";
import { EnumSelectorOutputType } from "../enums/enum-selector-output-type";
import { InputFile } from "./input-file";

export type SelectorResponse = {
    type: EnumSelectorOutputType;
    data: Promise<PipelineStep> | Promise<InputFile[]>[];
};