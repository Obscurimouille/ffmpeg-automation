import { WorkspaceService } from "../services/workspace/workspace.service";
import { PipelineStep } from "./pipeline-step";
import { PipelineService } from "../services/pipeline/pipeline.service";
import { PipelineDTO } from "./dtos/models/pipeline-dto";

export class Pipeline {

    private model: PipelineDTO
    private steps: PipelineStep[] = [];

    constructor(model: PipelineDTO) {
        this.model = model;
    }

    public async run(): Promise<void> {

        WorkspaceService.clearWorkspace();

        // this.steps = PipelineStepService.instanciateSteps(this.model.steps);

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