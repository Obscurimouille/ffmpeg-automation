import { PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../enums/enum-step-type";
import { EnumStatement } from "../../enums/enum-statement";
import { StatementArgsDTO } from "../dtos/models/args-dto";

/**
 * A pipeline statement.
 */
export class PipelineStatement extends PipelineStep {

    public static override readonly IDENTIFIER: EnumStatement;

    /* -------------------------------------------------------------------------- */

    constructor(id: number, name: string, args: StatementArgsDTO) {
        console.log(`Creating statement ${id}...`);
        super(id, EnumStepType.STATEMENT, name, args);
        this.args = args;
    }

}
