import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { SyncArgsDTO } from "./sync-args";
import { InstructionDTO } from "../../../dtos/models/instruction-dto";

export class SyncDTO extends InstructionDTO {

    @Expose()
    @ValidateNested()
    @Type(() => SyncArgsDTO)
    public override args!: SyncArgsDTO;

}