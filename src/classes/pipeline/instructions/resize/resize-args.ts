import { Expose } from "class-transformer";
import { IsHexColor, IsNumber, IsOptional, IsPositive, IsString, Max, Min, Validate } from "class-validator";
import { Optional, ValidAspectRatio, ValidFileInputs, ValidPad } from "../../../../modules/validators/pipeline-validators";
import { InstructionArgsDTO } from "../../../dtos/models/args-dto";
import { InputFile } from "../../../../types/input-file";

export class ResizeArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1, videoOnly: true }])
    public override input!: InputFile[];

    @Expose()
    @IsNumber()
    @IsPositive()
    @Validate(Optional, [{ includeAll: ['height', 'ratio'] }])
    public width?: number;

    @Expose()
    @IsNumber()
    @IsPositive()
    @Validate(Optional, [{ includeAll: ['width', 'ratio'] }])
    public height?: number;

    @Expose()
    @IsNumber()
    @Min(0)
    @Max(10, { message: "Ratio must cannot be greater than 10" })
    @Validate(Optional, [{ includeAll: ['width', 'height'] }])
    public ratio?: number;

    @Expose()
    @IsOptional()
    @IsString()
    @Validate(ValidAspectRatio)
    public aspect?: string;

    @Expose()
    @IsOptional()
    @Validate(ValidPad)
    public pad?: boolean | string;

}