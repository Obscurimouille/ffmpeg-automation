import { Expose } from "class-transformer";
import { IsDefined, IsEnum, ValidateNested } from "class-validator";
import { StatementArgsDTO } from "./args-dto";
import { StepDTO } from "./step-dto";
import { EnumStatement } from "../../../enums/enum-statement";

export class StatementDTO extends StepDTO {

    @Expose()
    @IsDefined({
        message: "missing name"
    })
    @IsEnum(EnumStatement)
    public override name!: EnumStatement;

    @Expose()
    @ValidateNested()
    public override args!: StatementArgsDTO;

}
