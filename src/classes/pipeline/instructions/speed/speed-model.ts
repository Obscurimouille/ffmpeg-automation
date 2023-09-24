import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { SpeedArgsDTO } from "./speed-args";
import { InstructionDTO } from "../../../dtos/models/instruction-dto";

export class SpeedDTO extends InstructionDTO {

    @Expose()
    @ValidateNested()
    @Type(() => SpeedArgsDTO)
    public override args!:SpeedArgsDTO;

}