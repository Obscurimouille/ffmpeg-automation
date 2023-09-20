import { WorkspaceService } from "../../services/workspace/workspace.service";
import { PipelineStep } from "./pipeline-step";
import { PipelineDTO } from "../dtos/models/pipeline-dto";
import { StepService } from "../../services/step/step.service";

export class Pipeline {

    private model: PipelineDTO
    private steps: PipelineStep[] = [];

    constructor(model: PipelineDTO) {
        this.model = model;
        this.steps = StepService.instanciateSteps(this.model.steps);
    }

    public async run(): Promise<void> {

        WorkspaceService.clearWorkspace();

        StepService.initSteps(this.steps);
        StepService.runSteps(this.steps);

        await StepService.waitForSteps(this.steps);
    }

}