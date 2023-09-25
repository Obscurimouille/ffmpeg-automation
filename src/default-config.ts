import { PipelineConfig } from "./types/pipeline-config";

export const DEFAULT_CONFIG: Required<PipelineConfig> = {
    pipelineFile: './pipeline.json',
    workspaceDir: './workspace/',
    inputDir: './resources/input/',
    outputDir: './resources/output/'
};