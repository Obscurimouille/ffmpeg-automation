import { Expose } from "class-transformer";
import { IsDefined, IsNumber, IsPositive, Validate } from "class-validator";
import { ValidFileInputs } from "../../../validators/pipeline-validators";
import { InstructionArgsDTO } from "../../../dtos/models/args-dto";
import { InputFile } from "../../../../types/input-file";

export class SpeedArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1 }])
    public override input!: InputFile[];

    @Expose()
    @IsDefined({
        message: "Speed must be defined"
    })
    @IsNumber()
    @IsPositive()
    public multiplier!: number;

}