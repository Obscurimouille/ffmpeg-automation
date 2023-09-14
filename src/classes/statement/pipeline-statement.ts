import { PipelineStatementArgsModel } from "../../types/pipeline-model";
import { PipelineStep } from "../pipeline-step";
import { EnumStepType } from "../../enums/enum-step-type";
import { EnumStatement } from "../../enums/enum-statement";

/**
 * A pipeline statement.
 */
export class PipelineStatement extends PipelineStep {

    public static readonly IDENTIFIER: EnumStatement;

    /* -------------------------------------------------------------------------- */

    constructor(id: number, name: string, args: PipelineStatementArgsModel) {
        console.log(`Creating statement ${id}...`);
        super(id, EnumStepType.STATEMENT, name, args);
        this.args = args;
    }

}
