import { Expose } from "class-transformer";
import { IsDefined, IsNumber, IsOptional, IsPositive, Min, Validate } from "class-validator";
import { ValidFileInputs } from "../../../../modules/validators/pipeline-validators";
import { InstructionArgsDTO } from "../../../dtos/models/args-dto";
import { InputFile } from "../../../../types/input-file";

export class SegmentArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1, videoOnly: true }])
    public override input!: InputFile[];

    @Expose()
    @IsDefined({
        message: "missing start time"
    })
    @IsNumber()
    @Min(0)
    public startTime!: number;

    @Expose()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    public duration?: number;

}