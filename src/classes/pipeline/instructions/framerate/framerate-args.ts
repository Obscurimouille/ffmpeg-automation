import { Expose } from "class-transformer";
import { IsDefined, IsNumber, IsPositive, Validate } from "class-validator";
import { ValidFileInputs } from "../../../../modules/validators/pipeline-validators";
import { InstructionArgsDTO } from "../../../dtos/models/args-dto";
import { InputFile } from "../../../../types/input-file";

export class FramerateArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1, videoOnly: true }])
    public override input!: InputFile[];

    @Expose()
    @IsDefined({
        message: "ips must be defined"
    })
    @IsNumber()
    @IsPositive()
    public ips!: number;

}