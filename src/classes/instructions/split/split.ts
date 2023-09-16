import { PipelineInstruction } from "../pipeline-instruction";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { SplitArgsDTO } from "./split-args";
import { InputFile } from "../../../types/input-file";
import { FfmpegService } from "../../../services/ffmpeg/ffmpeg.service";

/**
 * Split pipeline instruction.
 * - Split a video into multiple segments
 * - You can either specify the number of segments or the duration of each segment
 * - If you specify the number of segments, the duration of each segment will be calculated automatically
 * - If you specify the duration of each segment, the number of segments will be calculated automatically
 * - If you specify both, the video will be split into the number of segments you specified, each segment having the duration you specified
 *  • Input: 1 video file
 *  • Output: n video file
 * - Arguments:
 *  • segmentDuration: The duration of each segment (in seconds) (optional)
 *  • nbSegments: The number of segments to split the video into (optional)
 */
export class Split extends PipelineInstruction {

    public static override readonly IDENTIFIER = EnumInstruction.SPLIT;

    constructor(id: number, args: SplitArgsDTO) {
        super(id, Split.IDENTIFIER, args);
    }

    protected override FfmpegProcess(): Promise<InputFile[]> {
        return new Promise(async (resolve, reject) => {
            const inputFile = this._inputs[0];
            const processes: Promise<InputFile[]>[] = [];

            const metadata = await FfmpegService.probe(inputFile, (err) => {
                throw new Error(`Error: ${err}`);
            });

            let totalDuration = metadata.format.duration;

            if (!totalDuration) {
                throw new Error(`Error: Could not determine the duration of the input video`);
            }

            let segmentDuration = this.args.segmentDuration;
            let nbSegments = this.args.nbSegments;

            if (!segmentDuration && !nbSegments) {
                throw new Error(`Error: You must specify either the duration of each segment or the number of segments`);
            }
            // Calculate the number of segments and the duration of each segment depending on the arguments
            totalDuration = Math.round(totalDuration);
            if (!segmentDuration) segmentDuration = Math.ceil(totalDuration / nbSegments);
            else nbSegments = Math.ceil(totalDuration / segmentDuration);

            // Generate Ffmpeg commands to split the video
            for (let i = 0; i < nbSegments; i++) {
                const startTime = i * segmentDuration;
                const outputFile = this._workspaceOutputDir! + `segment-output-${i + 1}.mp4`;

                processes.push(new Promise((resolve, reject) => {
                    const command = FfmpegService.createCommand();
                    command
                        .input(inputFile)
                        .inputOptions([`-ss ${startTime}`, `-t ${segmentDuration}`])
                        .output(outputFile)
                        .on('end', () => {
                            resolve([outputFile]);
                        })
                        .on('error', (err) => {
                            reject(err);
                        })
                        .run();
                }));
            }

            // Wait for all the processes to end
            Promise.all(processes)
                .then((outputFiles) => {
                    resolve(outputFiles.flat());
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

}