import { Expose } from "class-transformer";
import { IsDefined, IsEnum, Validate, ValidateNested } from "class-validator";
import { ValidId, ValidStepName } from "../../validators/pipeline-validators";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { EnumStatement } from "../../../enums/enum-statement";
import { EnumStepType } from "../../../enums/enum-step-type";

export class StepDTO {

    @Expose()
    @IsDefined({
        message: "missing type"
    })
    @IsEnum(EnumStepType)
    public type!: EnumStepType;

    @Expose()
    @IsDefined({
        message: "missing name"
    })
    @Validate(ValidStepName)
    public name!: EnumInstruction | EnumStatement;

    @Expose()
    @Validate(ValidId)
    public id!: number;

    @Expose()
    @IsDefined({
        message: "missing arguments"
    })
    @ValidateNested()
    public args!: any;

}