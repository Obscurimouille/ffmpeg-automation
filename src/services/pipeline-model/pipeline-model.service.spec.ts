import { PipelineModelService } from './pipeline-model.service';

describe('isPipeline', () => {
    it('should return true for a valid Pipeline object', () => {
        const validPipeline = {
            steps: [
                {
                    input: ['input1.txt'],
                    instruction: { name: 'instruction1', args: ['arg1'] },
                    output: ['output1.txt'],
                },
            ],
        };

        expect(PipelineModelService.isPipelineModel(validPipeline)).toBe(true);
    });

    it('should return false for an invalid Pipeline object', () => {
        const invalidPipeline = {
            // Missing required properties
        };

        expect(PipelineModelService.isPipelineModel(invalidPipeline)).toBe(false);
    });
});

describe('isPipelineStep', () => {
    it('should return true for a valid PipelineStep object', () => {
        const validStep = {
            input: ['input1.txt'],
            instruction: { name: 'instruction1', args: ['arg1'] },
            output: ['output1.txt'],
        };

        expect(PipelineModelService.isPipelineStepModel(validStep)).toBe(true);
    });

    it('should return false for an invalid PipelineStep object', () => {
        const invalidStep = {
            // Missing required properties
            input: ['input1.txt'],
        };

        expect(PipelineModelService.isPipelineStepModel(invalidStep)).toBe(false);
    });
});
