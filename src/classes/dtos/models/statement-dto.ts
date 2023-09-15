import { Expose } from "class-transformer";
import { ValidateNested } from "class-validator";
import { StatementArgsDTO } from "./args-dto";
import { StepDTO } from "./step-dto";

export class StatementDTO extends StepDTO {

    @Expose()
    @ValidateNested()
    public override args!: StatementArgsDTO;

}
