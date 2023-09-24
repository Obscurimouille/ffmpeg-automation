import { ClassConstructor } from "class-transformer";
import { Foreach } from "./classes/pipeline/statement/foreach/foreach";
import { PipelineSelector } from "./classes/selectors/selector";
import { SelectorParent } from "./classes/selectors/parent/selector-parent";
import { SelectorStep } from "./classes/selectors/step/selector-step";
import { PipelineStatement } from "./classes/pipeline/statement/pipeline-statement";
import { PipelineInstruction } from "./classes/pipeline/instructions/pipeline-instruction";
import { Segment } from "./classes/pipeline/instructions/segment/segment";
import { Split } from "./classes/pipeline/instructions/split/split";
import { SelectorResources } from "./classes/selectors/resources/selector-resources";
import { Sync } from "./classes/pipeline/instructions/sync/sync";
import { Resize } from "./classes/pipeline/instructions/resize/resize";

export const SELECTORS: ClassConstructor<PipelineSelector>[] = [
    SelectorStep,
    SelectorParent,
    SelectorResources,
];

export const INSTRUCTIONS: ClassConstructor<PipelineInstruction>[] = [
    Segment,
    Split,
    Sync,
    Resize,
];

export const STATEMENTS: ClassConstructor<PipelineStatement>[] = [
    Foreach,
];