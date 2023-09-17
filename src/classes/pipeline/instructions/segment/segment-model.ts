import { Expose, Type } from "class-transformer";
import { SegmentArgsDTO } from "./segment-args";
import { ValidateNested } from "class-validator";
import { InstructionDTO } from "../../../dtos/models/instruction-dto";

export class SegmentDTO extends InstructionDTO {

    @Expose()
    @ValidateNested()
    @Type(() => SegmentArgsDTO)
    public override args!: SegmentArgsDTO;

}