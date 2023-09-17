import { PipelineInstruction } from "../pipeline-instruction";
import { EnumInstruction } from "../../../../enums/enum-instruction";
import { SegmentArgsDTO } from "./segment-args";
import { InputFile } from "../../../../types/input-file";
import { FfmpegService } from "../../../../services/ffmpeg/ffmpeg.service";
import { EnumArchiveFilter } from "../../../../enums/enum-archive-filter";

/**
 * Segment pipeline instruction.
 * - Export a segment of a video
 *  • Input: 1 video file
 *  • Output: 1 video file
 * - Arguments:
 *  • startTime: The start time of the segment (in seconds)
 *  • duration: The duration of the segment (in seconds) (optional)
 */
export class Segment extends PipelineInstruction {

    public static override readonly IDENTIFIER = EnumInstruction.SEGMENT;

    constructor(id: number, args: SegmentArgsDTO, archive?: EnumArchiveFilter) {
        super(id, Segment.IDENTIFIER, args, archive);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise((resolve, reject) => {
            // Get the input and output file paths
            const inputFile = this._inputs[0];
            const outputFile = this._workspaceOutputDir! + `${this.id}-segment-output.mp4`;
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

}