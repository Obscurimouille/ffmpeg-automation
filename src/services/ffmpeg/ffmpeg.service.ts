import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import { PipelineInstruction } from '../../classes/instructions/pipeline-instruction';

export type FfmpegCommand = ffmpeg.FfmpegCommand;

export class FfmpegService {

    public static init(): void {
        // Check if ffmpeg is installed
        if (!pathToFfmpeg) {
            throw new Error('Could not find FFmpeg executable');
        }

        ffmpeg.setFfmpegPath(pathToFfmpeg);
    }

    public static process(inputFiles: string[], instruction: PipelineInstruction, outputDir: string ): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const command = ffmpeg();
            // Add command parameters and get output files
            // instruction.setStepData(inputFiles, outputDir);
            const outputFiles = instruction.decorateCommand(command);

            command
                .on('end', () => {
                    resolve(outputFiles);
                })
                .on('error', (err) => {
                    reject(err);
                })
                // .on("progress", (progress) => {
				// 	const percentage = progress.percent.toFixed(2);
				// })
                .run();
        });
    }

    private static addInputs(ffmpegCommand: FfmpegCommand, inputFiles: string[]): void {
        for (const inputFile of inputFiles) {
            ffmpegCommand.input(inputFile);
        }
    }

}
