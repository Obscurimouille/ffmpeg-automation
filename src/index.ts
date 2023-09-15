import { RessourceService } from "./services/ressources/ressource.service";
import { FfmpegService } from "./services/ffmpeg/ffmpeg.service";
import { PipelineParser } from "./classes/pipeline-parser";

async function main(): Promise<void> {

    FfmpegService.init();

    const pipelineFile = RessourceService.getPipeline();

    if (!pipelineFile) {
        throw new Error("Error: Could not find pipeline file");
    }

    const parser = new PipelineParser(pipelineFile);
    const pipeline = parser.run((errorMessage) => {
        throw new Error(`Error: ${errorMessage}`);
    });

    RessourceService.clearOutputDirectory();

    // const pipeline = new Pipeline(pipelineModel);

    console.log('\nStarting pipeline...');
    // console.log(pipeline);

    // await pipeline.run();

    console.log('Pipeline ended');
}

main();