import { Expose } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { InstructionArgsDTO } from "./args-dto";
import { StepDTO } from "./step-dto";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { EnumArchiveFilter } from "../../../enums/enum-archive-filter";

export class InstructionDTO extends StepDTO {

    @Expose()
    @IsDefined({
        message: "missing name"
    })
    @IsEnum(EnumInstruction)
    public override name!: EnumInstruction;

    @Expose()
    @ValidateNested()
    public override args!: InstructionArgsDTO;

    @Expose()
    @IsOptional()
    @IsEnum(EnumArchiveFilter)
    public archive?: EnumArchiveFilter;

}