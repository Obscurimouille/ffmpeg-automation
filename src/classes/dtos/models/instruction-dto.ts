import { Expose } from "class-transformer";
import { IsDefined, IsEnum, ValidateNested } from "class-validator";
import { InstructionArgsDTO } from "./args-dto";
import { StepDTO } from "./step-dto";
import { EnumInstruction } from "../../../enums/enum-instruction";

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

}