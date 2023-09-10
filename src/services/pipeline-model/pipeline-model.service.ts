import { PipelineStep } from '../../classes/pipeline-step';
import { PipelineModel, PipelineStepModel } from '../../types/pipeline-model';
import { PipelineStepService } from '../pipeline-step/pipeline-step.service';
import { TypeService } from '../utils/type/type.service';

export class PipelineModelService {

    /**
     * Parse a pipeline file
     */
    public static parse(file: string): PipelineModel {
        let data;

        try {
            data = JSON.parse(file);
        } catch (error) {
            throw new Error('Could not parse pipeline file');
        }

        if (!PipelineModelService.isPipelineModel(data)) {
            throw new Error('Pipeline file does not conform to Pipeline type');
        }

        return data;
    }

    public static check(model: PipelineModel): void {
        // Get a copy of the model
        const preProcessedModel = { ...model };
        // Create a PipelineStep object for each step
        const steps: PipelineStep[] = PipelineStepService.instanciateSteps(preProcessedModel.steps)
        // Resolve each step
        for (const step of steps) {
            step.startResolution(steps);
        }
    }

    /**
     * Check if the parsed input conforms to the Pipeline type.
     */
    public static isPipelineModel(model: any): model is PipelineModel {
        return (
            typeof model === 'object' &&
            Array.isArray(model.steps) &&
            model.steps.every((step: any) => PipelineModelService.isPipelineStepModel(step))
        );
    }

    /**
     * Check if the parsed input conforms to the PipelineStep type.
     */
    public static isPipelineStepModel(step: any): step is PipelineStepModel {
        return (
            typeof step === 'object' &&
            TypeService.isStringArray(step.input) &&
            typeof step.instruction === 'object'
        );
    }
}
