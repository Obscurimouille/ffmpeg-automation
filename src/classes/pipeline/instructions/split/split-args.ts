import { Expose } from "class-transformer";
import { Validate } from "class-validator";
import { Optional, ValidFileInputs } from "../../../dtos/validators/pipeline-validators";
import { InstructionArgsDTO } from "../../../dtos/models/args-dto";
import { InputFile } from "../../../../types/input-file";

export class SplitArgsDTO extends InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs, [{ min: 1, max: 1, videoOnly: true }])
    public override input!: InputFile[];

    @Expose()
    // @IsNumber()
    // @IsPositive()
    @Validate(Optional, [{ includeAll: ['nbSegments'] }])
    public segmentDuration?: number;

    @Expose()
    // @IsNumber()
    // @IsPositive()
    @Validate(Optional, [{ includeAll: ['segmentDuration'] }])
    public nbSegments?: number;

}