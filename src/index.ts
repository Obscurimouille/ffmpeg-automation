import { RessourceService } from "./services/ressources/ressource.service";
import { PipelineModelService } from "./services/pipeline-model/pipeline-model.service";
import { FfmpegService } from "./services/ffmpeg/ffmpeg.service";
import { Pipeline } from "./classes/pipeline";

async function main(): Promise<void> {

    FfmpegService.init();

    const pipelineModelFile = RessourceService.getPipeline();

    if (!pipelineModelFile) {
        console.error("Error: Could not find pipeline file");
        process.exit(1);
    }

    let pipelineModel;

    try {
        pipelineModel = PipelineModelService.parse(pipelineModelFile);
        // PipelineModelService.check(pipelineModel);
    }
    catch (error: any) {
        console.error("Error:", error.message);
        process.exit(1);
    }

    RessourceService.clearOutputDirectory();

    const pipeline = new Pipeline(pipelineModel);

    console.log('\nStarting pipeline...');

    await pipeline.run();

    console.log('Pipeline ended');
}

main();