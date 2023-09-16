import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';

export type FfmpegCommand = ffmpeg.FfmpegCommand;

export class FfmpegService {

    public static init(): void {
        // Check if ffmpeg is installed
        if (!pathToFfmpeg) {
            throw new Error('Could not find FFmpeg executable');
        }

        ffmpeg.setFfmpegPath(pathToFfmpeg);
    }

    public static createCommand(): FfmpegCommand {
        return ffmpeg();
    }

    private static addInputs(ffmpegCommand: FfmpegCommand, inputFiles: string[]): void {
        for (const inputFile of inputFiles) {
            ffmpegCommand.input(inputFile);
        }
    }

}
