export type PipelineInstructionRequirements = {
    input: {
        nbFiles: number;
        videoOnly?: boolean;
        audioOnly?: boolean;
    },
    arguments?: {
        [key: string]: {
            type: 'number' | 'string' | 'boolean';
            optional?: boolean;
        }
    },
    output: {
        nbFiles: number | 'same' | 'undefined';
    }
};