import { PipelineInstruction } from "../pipeline-instruction";
import { InputFile } from "../../../../types/input-file";
import { FfmpegService } from "../../../../services/ffmpeg/ffmpeg.service";
import { Instruction } from "../../../../decorators/instruction.decorator";
import { ArchiveDTO } from "../../../dtos/models/archive";
import { FramerateArgsDTO } from "./framerate-args";
import path from "path";

/**
 * Framerate pipeline instruction.
 * - Change the framerate of a video.
 *  • Input: 1 video file
 *  • Output: 1 video file
 * - Arguments:
 *  • ips: The number of images per second of the output video.
 */
@Instruction({
    identifier: 'framerate',
})
export class Framerate extends PipelineInstruction {

    override args!: FramerateArgsDTO;

    constructor(id: number, args: FramerateArgsDTO, archive?: ArchiveDTO) {
        super(id, Framerate.IDENTIFIER, args, archive);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise(async (resolve, reject) => {
            // Get variables
            const inputFile = this._inputs[0];
            const outputFile = path.join(this._workspaceOutputDir!, `${this.id}-framerate-output.mp4`);
            const { ips } = this.args;

            if (!ips) throw new Error("Parameter ips must be defined");
            if (ips <= 0) throw new Error("Parameter ips must be greater than 0");

            const command = FfmpegService.createCommand();
            command
                .input(inputFile)
                .fps(ips)
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
        const filename = `${this.id}-framerate-output-${++this._outputFileIndex}.mp4`;
        return path.join(this._workspaceOutputDir, filename);
    }

}