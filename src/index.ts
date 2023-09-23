import { Pipeline } from "./classes/pipeline/pipeline";
import { logger } from "./logger";

async function main(): Promise<void> {

    const pipeline = new Pipeline();
    await pipeline.init();

    logger.info('Starting pipeline...');

    await pipeline.run();

    logger.info('Pipeline ended\n');
}

main();