import { PipelineInstruction } from "../pipeline-instruction";
import { InputFile } from "../../../../types/input-file";
import { FfmpegService } from "../../../../services/ffmpeg/ffmpeg.service";
import { Instruction } from "../../../../decorators/instruction.decorator";
import { ArchiveDTO } from "../../../dtos/models/archive";
import { SpeedArgsDTO } from "./speed-args";
import path from "path";
import { SpeedDTO } from "./speed-model";

/**
 * Speed pipeline instruction.
 * - Change the speed of a video.
 *  • Input: 1 video/audio file
 *  • Output: 1 video/audio file
 * - Arguments:
 *  • multiplier: The speed multiplier of the output video. 1.0 is normal speed, 2.0 is double speed, 0.5 is half speed, etc.
 */
@Instruction({
    identifier: 'speed',
    dtoModel: SpeedDTO,
})
export class Speed extends PipelineInstruction {

    override args!: SpeedArgsDTO;

    constructor(id: number, args: SpeedArgsDTO, archive?: ArchiveDTO) {
        super(id, Speed.IDENTIFIER, args, archive);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise(async (resolve, reject) => {
            // Get variables
            const inputFile = this._inputs[0];
            const outputFile = path.join(this._workspaceOutputDir!, `${this.id}-speed-output.mp4`);
            const { multiplier } = this.args;

            if (!multiplier) throw new Error("Multiplier must be defined");
            if (multiplier <= 0) throw new Error("Multiplier must be greater than 0");
            if (multiplier == 1) return resolve([inputFile]);

            const command = FfmpegService.createCommand();
            command
                .input(inputFile)
                .videoFilter(`setpts=${1 / multiplier}*PTS`)
                .audioFilter(`atempo=${multiplier}`)
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
        const filename = `${this.id}-speed-output-${++this._outputFileIndex}.mp4`;
        return path.join(this._workspaceOutputDir, filename);
    }

}