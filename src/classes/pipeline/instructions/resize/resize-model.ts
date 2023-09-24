import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ResizeArgsDTO } from "./resize-args";
import { InstructionDTO } from "../../../dtos/models/instruction-dto";

export class ResizeDTO extends InstructionDTO {

    @Expose()
    @ValidateNested()
    @Type(() => ResizeArgsDTO)
    public override args!: ResizeArgsDTO;

}