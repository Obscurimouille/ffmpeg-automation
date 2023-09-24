import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';
import { FfmpegCommandObject } from '../../types/ffmpeg';
import { Dimensions } from '../../types/dimensions';

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

    public static probe(file: string, onError?: (error: any) => void): Promise<ffmpeg.FfprobeData> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file, (err, data) => {
                if (err) {
                    if (onError) onError(err);
                    resolve({} as ffmpeg.FfprobeData);
                }
                else resolve(data);
            });
        });
    }

    public static getDuration(file: string, onError?: (error: any) => void): Promise<number | undefined> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file, (err, data) => {
                if (err) {
                    if (onError) onError(err);
                    return resolve(undefined);
                }
                resolve(data.format.duration);
            });
        });
    }

    public static getDimensions(file: string, onError?: (error: any) => void): Promise<Dimensions | undefined> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(file, (err, data) => {
                if (err) {
                    if (onError) onError(err);
                    return resolve(undefined);
                }
                const width = data.streams[0].width || 0;
                const height = data.streams[0].height || 0;
                resolve({ width, height });
            });
        });
    }
}

// Initialize ffmpeg
FfmpegService.init();