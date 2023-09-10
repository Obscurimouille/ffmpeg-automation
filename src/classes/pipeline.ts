import { PipelineModel } from "../types/pipeline-model";
import { WorkspaceService } from "../services/workspace/workspace.service";
import { PipelineStep } from "./pipeline-step";
import { PipelineStepService } from "../services/pipeline-step/pipeline-step.service";
import { PipelineService } from "../services/pipeline/pipeline.service";

export class Pipeline {

    private model: PipelineModel
    private steps: PipelineStep[] = [];

    constructor(model: PipelineModel) {
        this.model = model;
    }

    public async run(): Promise<void> {

        WorkspaceService.clearWorkspace();

        this.steps = PipelineStepService.instanciateSteps(this.model.steps);

        // Resolve each step
        for (const step of this.steps) {
            // The array of steps is given in case the step needs another steps reference
            step.startResolution(this.steps);
        }

        // Start each step
        for (const step of this.steps) {
            step.run();
        }

        await PipelineService.waitForSteps(this.steps);
    }

}