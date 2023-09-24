import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { FramerateArgsDTO } from "./framerate-args";
import { InstructionDTO } from "../../../dtos/models/instruction-dto";

export class FramerateDTO extends InstructionDTO {

    @Expose()
    @ValidateNested()
    @Type(() => FramerateArgsDTO)
    public override args!:FramerateArgsDTO;

}