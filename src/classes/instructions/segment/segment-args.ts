import { Expose } from "class-transformer";
import { IsDefined, IsNumber, IsOptional, Validate } from "class-validator";
import { ValidFileInputs } from "../../validators/step-validators";
import { InstructionArgsDTO } from "../../dtos/args-dto";
import { InputFile } from "../../../types/input-file";

export class SegmentArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1 }])
    public override input!: InputFile[];

    @Expose()
    @IsDefined()
    @IsNumber()
    public startTime!: number;

    @Expose()
    @IsOptional()
    @IsNumber()
    public duration?: number;

}