import { Expose } from "class-transformer";
import { IsEnum, IsOptional, Validate } from "class-validator";
import { EnumArchiveFilter } from "../../../enums/enum-archive-filter";
import { ValidSelector } from "../../validators/pipeline-validators";
import { EnumSelectorOutputType } from "../../../enums/enum-selector-output-type";

export class ArchiveDTO {

    @Expose()
    @IsOptional()
    @Validate(ValidSelector, [{ expectedType: EnumSelectorOutputType.STEP_INSTANCE }])
    public target?: string;

    @Expose()
    @IsOptional()
    @IsEnum(EnumArchiveFilter)
    public filter?: EnumArchiveFilter

}