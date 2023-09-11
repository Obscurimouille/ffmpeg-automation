import { RessourceService } from "./services/ressources/ressource.service";
import { FfmpegService } from "./services/ffmpeg/ffmpeg.service";
import { Pipeline } from "./classes/pipeline";
import { PipelineParser } from "./classes/pipeline-parser";

async function main(): Promise<void> {

    FfmpegService.init();

    const pipelineModelFile = RessourceService.getPipeline();

    if (!pipelineModelFile) {
        console.error("Error: Could not find pipeline file");
        process.exit(1);
    }

    const parser = new PipelineParser(pipelineModelFile);
    const pipelineModel = parser.run((errorMessage) => {
        console.error("Error:", errorMessage);
        process.exit(1);
    });

    RessourceService.clearOutputDirectory();

    const pipeline = new Pipeline(pipelineModel);

    console.log('\nStarting pipeline...');

    await pipeline.run();

    console.log('Pipeline ended');
}

main();