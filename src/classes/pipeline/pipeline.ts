import { WorkspaceService } from "../../services/workspace/workspace.service";
import { PipelineStep } from "./pipeline-step";
import { PipelineDTO } from "../dtos/models/pipeline-dto";
import { StepService } from "../../services/step/step.service";
import { PipelineParser } from "./pipeline-parser";
import { ResourceService } from "../../services/resources/resource.service";
import { FileService } from "../../services/utils/file/file.service";
import { PipelineConfig } from "../../types/pipeline-config";
import { DEFAULT_CONFIG } from "../../default-config";
import { PipelineCustomConfig } from "../../types/pipeline-custom-config";
import { PipelineConfigService } from "../../services/pipeline/pipeline-config.service";

export class Pipeline {

    private config: PipelineConfig;
    private pipelineFile!: string;
    private model!: PipelineDTO;
    private steps: PipelineStep[] = [];

    /**
     * Create a new pipeline.
     * @param config Custom configuration for the pipeline (optional)
     */
    constructor(config?: PipelineCustomConfig) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        PipelineConfigService.set(this.config);
        this.pipelineFile = this.getPipelineFile(this.config.pipelineFile!);
    }

    public async init(): Promise<void> {
        const parser = new PipelineParser(this.pipelineFile);
        this.model = await parser.run((errorMessage) => {
            throw new Error(`Error: ${errorMessage}`);
        });
        this.initWorkspaceDirectories();
        this.steps = StepService.instanciateSteps(this.model.steps);
    }

    public async run(): Promise<void> {
        StepService.initSteps(this.steps);
        StepService.runSteps(this.steps);

        await StepService.waitForSteps(this.steps);
    }

    private getPipelineFile(location: string): string {
        const pipelineFile = FileService.getFile(location);
        if (pipelineFile) return pipelineFile;
        console.error("Could not find any pipeline file at " + location);
        process.exit(1);
    }

    private initWorkspaceDirectories(): void {
        FileService.createDirectory(ResourceService.INPUT_DIRECTORY);
        FileService.createDirectory(ResourceService.OUTPUT_DIRECTORY);
        FileService.createDirectory(WorkspaceService.WORKSPACE_DIRECTORY);
        ResourceService.clearOutputDirectory();
        WorkspaceService.clearWorkspace();
    }

}