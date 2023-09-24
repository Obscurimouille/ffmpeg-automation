import { PipelineInstruction } from "../pipeline-instruction";
import { InputFile } from "../../../../types/input-file";
import { FfmpegService } from "../../../../services/ffmpeg/ffmpeg.service";
import { Instruction } from "../../../../decorators/instruction.decorator";
import { ArchiveDTO } from "../../../dtos/models/archive";
import { ResizeArgsDTO } from "./resize-args";
import path from "path";

/**
 * Resize pipeline instruction.
 * - Change the size of a video.
 *  • Input: 1 video file
 *  • Output: 1 video file
 * - Arguments:
 *  • width: The width of the output video. If not specified, the width will be automatically calculated based on the height and aspect ratio.
 *  • height: The height of the output video. If not specified, the height will be automatically calculated based on the width and aspect ratio.
 *  • ratio: The ratio of the output video. If not specified, the ratio will be automatically calculated based on the width and height.
 *  • aspect: The aspect ratio of the output video. If not specified, the aspect ratio will be automatically calculated based on the width and height.
 *  • pad: Whether to pad the output video to the specified width and height. If not specified, the output video will be padded by default. False to disable padding, true to enable padding with a black background, or a hex color code to enable padding with a custom color (default: true).
 */
@Instruction({
    identifier: 'resize',
})
export class Resize extends PipelineInstruction {

    override args!: ResizeArgsDTO;

    constructor(id: number, args: ResizeArgsDTO, archive?: ArchiveDTO) {
        super(id, Resize.IDENTIFIER, args, archive);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise(async (resolve, reject) => {
            // Get variables
            const inputFile = this._inputs[0];
            const outputFile = path.join(this._workspaceOutputDir!, `${this.id}-resize-output.mp4`);

            const { width, height, ratio, aspect, pad } = this.args;
            const enablePad = (pad == undefined) ? true : !!pad;
            const padColor = (pad && typeof pad == 'string') ? pad : 'black';

            const targetWidth = width ? String(width) : '?';
            const targetHeight = height ? String(height) : '?';
            const sizeText = ratio ? `${ratio * 100}%` : `${targetWidth}x${targetHeight}`;

            const command = FfmpegService.createCommand();
            command
                .input(inputFile)
                .size(sizeText)

            if (aspect) command.aspect(aspect);
            command.autopad(enablePad, padColor);

            command.output(outputFile)
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
        const filename = `${this.id}-resize-output-${++this._outputFileIndex}.mp4`;
        return path.join(this._workspaceOutputDir, filename);
    }

}