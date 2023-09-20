import { ClassConstructor } from "class-transformer";
import { Foreach } from "./classes/pipeline/statement/foreach/foreach";
import { PipelineSelector } from "./classes/selectors/selector";
import { SelectorParent } from "./classes/selectors/selector-parent";
import { SelectorStep } from "./classes/selectors/selector-step";
import { PipelineStatement } from "./classes/pipeline/statement/pipeline-statement";
import { PipelineInstruction } from "./classes/pipeline/instructions/pipeline-instruction";
import { Segment } from "./classes/pipeline/instructions/segment/segment";
import { Split } from "./classes/pipeline/instructions/split/split";

export const SELECTORS: ClassConstructor<PipelineSelector>[] = [
    SelectorStep,
    SelectorParent,
];

export const INSTRUCTIONS: ClassConstructor<PipelineInstruction>[] = [
    Segment,
    Split,
];

export const STATEMENTS: ClassConstructor<PipelineStatement>[] = [
    Foreach,
];