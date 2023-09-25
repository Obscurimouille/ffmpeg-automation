import { PipelineInstruction } from "../pipeline-instruction";
import { SegmentArgsDTO } from "./segment-args";
import { InputFile } from "../../../../types/input-file";
import { FfmpegService } from "../../../../services/ffmpeg/ffmpeg.service";
import { Instruction } from "../../../../decorators/instruction.decorator";
import { ArchiveDTO } from "../../../dtos/models/archive";
import path from "path";
import { SegmentDTO } from "./segment-model";

/**
 * Segment pipeline instruction.
 * - Export a segment of a video
 *  • Input: 1 video file
 *  • Output: 1 video file
 * - Arguments:
 *  • startTime: The start time of the segment (in seconds)
 *  • duration: The duration of the segment (in seconds) (optional)
 */
@Instruction({
    identifier: 'segment',
    dtoModel: SegmentDTO,
})
export class Segment extends PipelineInstruction {

    override args!: SegmentArgsDTO;

    constructor(id: number, args: SegmentArgsDTO, archive?: ArchiveDTO) {
        super(id, Segment.IDENTIFIER, args, archive);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise((resolve, reject) => {
            // Get the input and output file paths
            const inputFile = this._inputs[0];
            const outputFile = path.join(this._workspaceOutputDir!, `${this.id}-segment-output.mp4`);
            // Generate options
            const options = [`-ss ${this.args.startTime}`];
            if (this.args.duration) options.push(`-t ${this.args.duration}`);
            // Process the video
            const command = FfmpegService.createCommand();
            command
                .input(inputFile)
                .inputOptions(options)
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
        const filename = `${this.id}-segement-output.mp4`;
        return path.join(this._workspaceOutputDir, filename);
    }

}