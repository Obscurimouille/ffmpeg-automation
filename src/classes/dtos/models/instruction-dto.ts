import { Expose, Type } from "class-transformer";
import { IsDefined, IsEnum, IsOptional, ValidateNested } from "class-validator";
import { InstructionArgsDTO } from "./args-dto";
import { StepDTO } from "./step-dto";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { ArchiveDTO } from "./archive";

export class InstructionDTO extends StepDTO {

    @Expose()
    @IsDefined({
        message: "missing name"
    })
    @IsEnum(EnumInstruction)
    public override name!: EnumInstruction;

    @Expose()
    @ValidateNested()
    @Type(() => InstructionArgsDTO)
    public override args!: InstructionArgsDTO;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => ArchiveDTO)
    public archive?: ArchiveDTO;

}