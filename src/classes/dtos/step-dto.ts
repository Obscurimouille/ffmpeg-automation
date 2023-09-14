import { Expose } from "class-transformer";
import { IsDefined, Validate, ValidateNested } from "class-validator";
import { ValidId, ValidStepName, ValidStepType } from "../validators/pipeline-validators";
import { EnumInstruction } from "../../enums/enum-instruction";
import { EnumStatement } from "../../enums/enum-statement";
import { EnumStepType } from "../../enums/enum-step-type";

export abstract class StepDTO {

    @Expose()
    @IsDefined()
    @Validate(ValidStepType)
    public type!: EnumStepType;

    @Expose()
    @IsDefined()
    @Validate(ValidStepName)
    public name!: EnumInstruction | EnumStatement;

    @Expose()
    @IsDefined()
    @Validate(ValidId)
    public id!: number;

    @Expose()
    @IsDefined()
    @ValidateNested()
    public args!: any;

}