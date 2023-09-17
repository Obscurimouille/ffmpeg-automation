import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';

export type FfmpegCommandObject = ffmpeg.FfmpegCommand;

export class FfmpegService {

    public static init(): void {
        // Check if ffmpeg is installed
        if (!pathToFfmpeg) {
            throw new Error('Could not find FFmpeg executable');
        }

        ffmpeg.setFfmpegPath(pathToFfmpeg);
    }

    public static createCommand(): FfmpegCommandObject {
        return ffmpeg();
    }

    public static probe(file: string, onError: (error: any) => void): Promise<ffmpeg.FfprobeData> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file, (err, data) => {
                if (err) {
                    onError(err);
                    resolve({} as ffmpeg.FfprobeData);
                }
                else resolve(data);
            });
        });
    }

}
