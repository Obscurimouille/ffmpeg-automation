import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { StepDTO } from "../../../dtos/models/step-dto";
import { SplitArgsDTO } from "./split-args";

export class SplitDTO extends StepDTO {

    @Expose()
    @ValidateNested()
    @Type(() => SplitArgsDTO)
    public override args!: SplitArgsDTO;

}