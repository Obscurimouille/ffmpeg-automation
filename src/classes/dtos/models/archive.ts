import { Expose } from "class-transformer";
import { IsEnum, IsOptional, Validate } from "class-validator";
import { EnumArchiveFilter } from "../../../enums/enum-archive-filter";
import { ValidSelector } from "../../validators/pipeline-validators";

export class ArchiveDTO {

    @Expose()
    @IsOptional()
    @Validate(ValidSelector)
    // TODO
    public target?: string;

    @Expose()
    @IsOptional()
    @IsEnum(EnumArchiveFilter)
    public filter?: EnumArchiveFilter

}