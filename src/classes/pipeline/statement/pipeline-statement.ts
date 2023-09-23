import { PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../../enums/enum-step-type";
import { EnumStatement } from "../../../enums/enum-statement";
import { StatementArgsDTO } from "../../dtos/models/args-dto";
import { InputFile } from "../../../types/input-file";
import { ArchiveDTO } from "../../dtos/models/archive";

/**
 * A pipeline statement.
 */
export abstract class PipelineStatement extends PipelineStep {

    public static override readonly IDENTIFIER: EnumStatement;

    /* -------------------------------------------------------------------------- */

    constructor(id: number, name: string, args: StatementArgsDTO, archive?: ArchiveDTO) {
        super(id, EnumStepType.STATEMENT, name, args, archive);
    }

    public get currentItem(): InputFile {
        throw new Error('Not implemented');
    }

}
