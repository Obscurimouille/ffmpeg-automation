import { Expose, Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { StatementDTO } from "../../../dtos/models/statement-dto";
import { ForeachArgsDTO } from "./foreach-args";
import { ArchiveDTO } from "../../../dtos/models/archive";

export class ForeachDTO extends StatementDTO {

    @Expose()
    @ValidateNested()
    @Type(() => ForeachArgsDTO)
    public override args!: ForeachArgsDTO;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => ArchiveDTO)
    public archive?: ArchiveDTO;

}