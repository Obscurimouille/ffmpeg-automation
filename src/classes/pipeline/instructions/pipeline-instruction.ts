import { EnumInstruction } from "../../../enums/enum-instruction";
import { EnumPipelineStepStatus, PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../../enums/enum-step-type";
import { InstructionArgsDTO } from "../../dtos/models/args-dto";
import { InputFile } from "../../../types/input-file";
import { EnumArchiveFilter } from "../../../enums/enum-archive-filter";
import { InstructionService } from "../../../services/instruction/instruction.service";

/**
 * A pipeline instruction.
 */
export abstract class PipelineInstruction extends PipelineStep {

    public static override readonly IDENTIFIER: EnumInstruction;

    protected _workspaceOutputDir!: string;
    protected _archiveFilter: EnumArchiveFilter;

    constructor(id: number, name: string, args: InstructionArgsDTO, archive?: EnumArchiveFilter) {
        super(id, EnumStepType.INSTRUCTION, name, args);
        this._archiveFilter = archive || EnumArchiveFilter.NONE;
    }

    public override async run(): Promise<void> {
        // Wait until the step is resolved
        await this.waitForStatus(EnumPipelineStepStatus.RESOLVED);
        // Set the status to processing
        this.setStatus(EnumPipelineStepStatus.PROCESSING);

        this._workspaceOutputDir = this._workspaceDir + 'output/';
        const outputFiles = await this.FfmpegProcess();

        // Set the status to ended
        InstructionService.archiveFiles(outputFiles, this._archiveFilter);
        this._processEnded.next(outputFiles);
        this.setStatus(EnumPipelineStepStatus.ENDED);
    }

    protected abstract FfmpegProcess(): Promise<InputFile[]>;

}
