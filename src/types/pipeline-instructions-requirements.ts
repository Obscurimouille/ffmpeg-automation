export type PipelineInstructionRequirements = {
    input: {
        nbFiles: number;
        videoOnly?: boolean;
        audioOnly?: boolean;
    },
    output: {
        nbFiles: number | 'same' | 'undefined';
    }
};