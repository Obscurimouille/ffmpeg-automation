import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import { Dimensions } from '../../types/dimensions';

export class FfmpegService {

    /**
     * Initialize ffmpeg.
     */
    public static init(): void {
        // Check if ffmpeg is installed
        if (!pathToFfmpeg) {
            throw new Error('Could not find FFmpeg executable');
        }

        ffmpeg.setFfmpegPath(pathToFfmpeg);
    }

    /**
     * Create a new ffmpeg command.
     */
    public static createCommand(): ffmpeg.FfmpegCommand {
        return ffmpeg();
    }

    /**
     * Get the data of an audio or video file.
     * @param file The path to the audio or video file
     * @param onError A callback function to handle errors
     * @returns Asyncronously returns the data of the audio or video
     */
    public static getData(file: string, onError?: (error: any) => void): Promise<ffmpeg.FfprobeData> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file, (err, data) => {
                if (err) {
                    if (onError) onError(err);
                    return resolve({} as ffmpeg.FfprobeData);
                }
                resolve(data);
            });
        });
    }

    /**
     * Get the duration of an audio or video file.
     * @param file The path to the audio or video file
     * @param onError A callback function to handle errors
     * @returns Asyncronously returns the duration in seconds of the audio or video
     */
    public static getDuration(file: string, onError?: (error: any) => void): Promise<number | undefined> {
        return new Promise(async (resolve, reject) => {
            const data = await FfmpegService.getData(file, onError);
            resolve(data?.format?.duration);
        });
    }

    /**
     * Get the dimensions of a video file.
     * @param file The path to the video file
     * @param onError A callback function to handle errors
     * @returns Asyncronously returns the width and height of the video
     */
    public static getDimensions(file: string, onError?: (error: any) => void): Promise<Partial<Dimensions>> {
        return new Promise(async (resolve, reject) => {
            const data = await FfmpegService.getData(file, onError);
            const { width, height } = data.streams[0];
            resolve({ width, height });
        });
    }
}

// Initialize ffmpeg
FfmpegService.init();