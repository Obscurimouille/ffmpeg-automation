import { Expose } from "class-transformer";
import { IsDefined, IsNumber, Validate } from "class-validator";
import { ValidFileInputs } from "../../../../modules/validators/pipeline-validators";
import { InstructionArgsDTO } from "../../../dtos/models/args-dto";
import { InputFile } from "../../../../types/input-file";

export class SyncArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1, videoOnly: true }])
    public override input!: InputFile[];

    @Expose()
    @IsDefined({
        message: 'missing audio delay',
    })
    @IsNumber()
    public delay!: number;

}