import { PipelineConfig } from "../../types/pipeline-config";
import { ResourceService } from "../resources/resource.service";
import { WorkspaceService } from "../workspace/workspace.service";

export class PipelineConfigService {

    public static set(config: Required<PipelineConfig>): void {
        ResourceService.setInputDirectory(config.inputDir);
        ResourceService.setOutputDirectory(config.outputDir);

        WorkspaceService.setWorkspaceDirectory(config.workspaceDir);
    }

}