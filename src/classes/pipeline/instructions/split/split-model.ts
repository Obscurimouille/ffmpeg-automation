import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { SplitArgsDTO } from "./split-args";
import { InstructionDTO } from "../../../dtos/models/instruction-dto";

export class SplitDTO extends InstructionDTO {

    @Expose()
    @ValidateNested()
    @Type(() => SplitArgsDTO)
    public override args!: SplitArgsDTO;

}