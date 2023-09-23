import { WorkspaceService } from "../../services/workspace/workspace.service";
import { PipelineStep } from "./pipeline-step";
import { PipelineDTO } from "../dtos/models/pipeline-dto";
import { StepService } from "../../services/step/step.service";
import { PipelineParser } from "./pipeline-parser";
import { ResourceService } from "../../services/resources/resource.service";
import { FileService } from "../../services/utils/file/file.service";

export class Pipeline {

    public static readonly DEFAULT_PIPELINE_PATH = './resources/pipeline.json';

    private pipelineFile!: string;
    private model!: PipelineDTO
    private steps: PipelineStep[] = [];

    /**
     * Create a new pipeline.
     * @param filepath The path to the pipeline file to use (default: './resources/pipeline.json')
     */
    constructor(filepath?: string) {
        const pipelineFile = FileService.getFile(filepath || Pipeline.DEFAULT_PIPELINE_PATH);
        if (!pipelineFile) throw new Error("Error: Could not find pipeline file at " + filepath || Pipeline.DEFAULT_PIPELINE_PATH);
        this.pipelineFile = pipelineFile;
    }

    public async init(): Promise<void> {
        const parser = new PipelineParser(this.pipelineFile);
        this.model = await parser.run((errorMessage) => {
            throw new Error(`Error: ${errorMessage}`);
        });
        ResourceService.clearOutputDirectory();
        this.steps = StepService.instanciateSteps(this.model.steps);
    }

    public async run(): Promise<void> {
        WorkspaceService.clearWorkspace();

        StepService.initSteps(this.steps);
        StepService.runSteps(this.steps);

        await StepService.waitForSteps(this.steps);
    }

}