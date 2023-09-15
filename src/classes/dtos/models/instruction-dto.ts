import { Expose } from "class-transformer";
import { ValidateNested } from "class-validator";
import { InstructionArgsDTO } from "./args-dto";
import { StepDTO } from "./step-dto";

export class InstructionDTO extends StepDTO {

    @Expose()
    @ValidateNested()
    public override args!: InstructionArgsDTO;

}