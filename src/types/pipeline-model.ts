import { EnumInstruction } from "../enums/enum-instruction";
import { EnumStatement } from "../enums/enum-statement";

export type PipelineModel = {
    steps: PipelineStepModel[];
};

export type PipelineStepModel = PipelineInstructionModel | PipelineStatementModel;

export type PipelineInstructionModel = {
    instruction: EnumInstruction;
    id: PipelineStepId;
    input: StepFileInput[];
    args: PipelineInstructionArgsModel;
}

export type PipelineStatementModel = {
    statement: EnumStatement;
    id: PipelineStepId;
    args: PipelineStatementArgsModel;
}

export type PipelineStepId = number;
export type StepFileInput = string;

export type PipelineInstructionArgsModel = {[key: string]: any};
export type PipelineStatementArgsModel = {[key: string]: any};