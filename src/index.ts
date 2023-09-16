import { RessourceService } from "./services/ressources/ressource.service";
import { FfmpegService } from "./services/ffmpeg/ffmpeg.service";
import { PipelineParser } from "./classes/pipeline-parser";
import { Pipeline } from "./classes/pipeline";

async function main(): Promise<void> {

    FfmpegService.init();

    const pipelineFile = RessourceService.getPipeline();

    if (!pipelineFile) throw new Error("Error: Could not find pipeline file");

    const parser = new PipelineParser(pipelineFile);
    const pipelineDTO = parser.run((errorMessage) => {
        throw new Error(`Error: ${errorMessage}`);
    });

    RessourceService.clearOutputDirectory();

    const pipeline = new Pipeline(pipelineDTO);

    console.log('\nStarting pipeline...');

    await pipeline.run();

    console.log('Pipeline ended');
}

main();