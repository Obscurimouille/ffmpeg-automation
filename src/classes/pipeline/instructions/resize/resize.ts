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
 *  •
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

            console.log("dimensions");
            console.log(await FfmpegService.getDimensions(inputFile));

            console.log("this.args")
            console.log(this.args)

            const command = FfmpegService.createCommand();

            const targetWidth = width ? String(width) : '?';
            const targetHeight = height ? String(height) : '?';
            const sizeText = ratio ? `${ratio * 100}%` : `${targetWidth}x${targetHeight}`;
            console.log(sizeText);

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