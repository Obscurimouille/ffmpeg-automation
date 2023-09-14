import { Expose, Type } from "class-transformer";
import { SegmentArgsDTO } from "./segment-args";
import { ValidateNested } from "class-validator";
import { StepDTO } from "../../dtos/step-dto";

export class SegmentDTO extends StepDTO {

    @Expose()
    @ValidateNested()
    @Type(() => SegmentArgsDTO)
    public override args!: SegmentArgsDTO;

}