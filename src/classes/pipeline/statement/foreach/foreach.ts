import { PipelineStatement } from "../pipeline-statement";
import { ForeachArgsDTO } from "./foreach-args";
import { Statement } from "../../../../decorators/statement.decorator";
import { PipelineStep } from "../../pipeline-step";
import { StepService } from "../../../../services/step/step.service";
import { InputFile } from "../../../../types/input-file";
import { ArchiveDTO } from "../../../dtos/models/archive";
import path from "path";
import { ForeachDTO } from "./foreach-model";

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
@Statement({
    identifier: 'foreach',
    dtoModel: ForeachDTO,
})
export class Foreach extends PipelineStatement {

    public steps: PipelineStep[] = [];
    private currentLoopItem!: InputFile;

    constructor(id: number, args: ForeachArgsDTO, archive?: ArchiveDTO) {
        super(id, Foreach.IDENTIFIER, args, archive);
        this.steps = StepService.instanciateSteps(this.args.steps);
    }

    public override async process(): Promise<string[]> {
        console.log(`- Step ${this.id} process...`);

        for (const input of this._inputs) {
            this.currentLoopItem = input;
            // Instanciate the steps
            this.steps = StepService.instanciateSteps(this.args.steps);

            StepService.initSteps(this.steps, this._pipelineSteps);
            StepService.runSteps(this.steps);

            await StepService.waitForSteps(this.steps);
        }
        return [];
    }

    public override get currentItem(): InputFile {
        return this.currentLoopItem;
    }

    protected override newFilepath(extension: string): string {
        const filename = `${this.id}-loop-output-${++this._outputFileIndex}.${extension}`;
        return path.join(this._workspaceOutputDir, filename);
    }

}