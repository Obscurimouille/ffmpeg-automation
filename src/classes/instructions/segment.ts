import { PipelineInstruction } from "./pipeline-instruction";
import { PipelineInstructionRequirements } from "../../types/pipeline-instructions-requirements";
import { FfmpegCommand } from "../../services/ffmpeg/ffmpeg.service";
import { PipelineInstructionArgsModel } from "../../types/pipeline-model";
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

    public static override readonly IDENTIFIER: string = "segment";
    public static override readonly REQUIREMENTS: PipelineInstructionRequirements = {
        input: {
            nbFiles: 1,
            videoOnly: true
        },
        arguments: {
            startTime: {
                type: "number"
            },
            duration: {
                type: "number",
                optional: true
            }
        },
        output: {
            nbFiles: 1,
        }
    };

    constructor(args: PipelineInstructionArgsModel) {
        super(args);
    }

    protected override processCommand(command: FfmpegCommand): string[] {
        const options = [`-ss ${this.args.startTime}`];
        if (this.args.duration) options.push("-t " + this.args.duration);
        const outputFile = this.outputDir! + "vid_1.mp4";

        command.input(this.inputFiles![0]);
        command.inputOptions(options);
        command.output(outputFile);

        return [outputFile];
    }

}