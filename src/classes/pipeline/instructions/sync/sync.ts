import { PipelineInstruction } from "../pipeline-instruction";
import { InputFile } from "../../../../types/input-file";
import { FfmpegService } from "../../../../services/ffmpeg/ffmpeg.service";
import { Instruction } from "../../../../decorators/instruction.decorator";
import { ArchiveDTO } from "../../../dtos/models/archive";
import { SyncArgsDTO } from "./sync-args";
import path from "path";

/**
 * Sync pipeline instruction.
 * - Delays the audio of a video in order to sync it back with the video
 *  • Input: 1 video file
 *  • Output: 1 video file
 * - Arguments:
 *  • delay: The delay to apply to the audio (in seconds)
 */
@Instruction({
    identifier: 'sync',
})
export class Sync extends PipelineInstruction {

    constructor(id: number, args: SyncArgsDTO, archive?: ArchiveDTO) {
        super(id, Sync.IDENTIFIER, args, archive);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise(async (resolve, reject) => {
            // Get variables
            const inputFile = this._inputs[0];
            const outputFile = path.join(this._workspaceOutputDir!, `${this.id}-sync-output.mp4`);
            const delay = this.args.delay;

            const command = FfmpegService.createCommand();
            command.input(inputFile);

            // Add delay on the audio when the video is behind the audio
            if (delay > 0) command.audioFilters(`adelay=${delay * 1000}|${delay * 1000}`);
            // Add delay on the video when the audio is behind the video
            else command.videoFilters(`setpts=PTS+${-delay}/TB`);

            command
                .output(outputFile)
                .on('end', () => {
                    resolve([outputFile]);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .run();
        });
    }

    protected override newFilepath(): string {
        const filename = `${this.id}-split-output-${++this._outputFileIndex}.mp4`;
        return path.join(this._workspaceOutputDir, filename);
    }

}