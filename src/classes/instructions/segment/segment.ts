import { PipelineInstruction } from "../pipeline-instruction";
import { FfmpegCommand } from "../../../services/ffmpeg/ffmpeg.service";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { SegmentArgsDTO } from "./segment-args";

/**
 * Segment pipeline instruction.
 * - Export a segment of a video
 * - Input: 1 video file
 * - Output: 1 video file
 * - Arguments:
 *  • startTime: The start time of the segment (in seconds)
 *  • duration: The duration of the segment (in seconds)
 */
export class Segment extends PipelineInstruction {

    public static override readonly IDENTIFIER = EnumInstruction.SEGMENT;

    constructor(id: number, args: SegmentArgsDTO) {
        super(id, EnumInstruction.SEGMENT, args);
    }

    protected override processCommand(command: FfmpegCommand): string[] {
        // const options = [`-ss ${this.args.startTime}`];
        // if (this.args.duration) options.push("-t " + this.args.duration);
        // const outputFile = this.outputDir! + "vid_1.mp4";

        // command.input(this.inputFiles![0]);
        // command.inputOptions(options);
        // command.output(outputFile);

        // return [outputFile];
        return [];
    }

}