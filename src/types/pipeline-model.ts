export type PipelineModel = {
    files: string[];
    steps: PipelineStepModel[];
};

export type PipelineStepModel = {
    input: string[];
    instruction: PipelineStepInstructionModel;
};

export type PipelineStepInstructionModel = {
    name: string;
    args: any[];
};