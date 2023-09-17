import { RessourceService } from "./services/ressources/ressource.service";
import { FfmpegService } from "./services/ffmpeg/ffmpeg.service";
import { PipelineParser } from "./classes/pipeline/pipeline-parser";
import { Pipeline } from "./classes/pipeline/pipeline";
import { logger } from "./logger";

async function main(): Promise<void> {

    init();

    const pipelineFile = RessourceService.getPipeline();

    if (!pipelineFile) throw new Error("Error: Could not find pipeline file");

    const parser = new PipelineParser(pipelineFile);
    const pipelineDTO = await parser.run((errorMessage) => {
        throw new Error(`Error: ${errorMessage}`);
    });

    RessourceService.clearOutputDirectory();

    const pipeline = new Pipeline(pipelineDTO);

    logger.info('Starting pipeline...');

    await pipeline.run();

    logger.info('Pipeline ended\n');
}

function init(): void {
    FfmpegService.init();
}

main();