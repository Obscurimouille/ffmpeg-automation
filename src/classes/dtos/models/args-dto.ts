import { Expose } from "class-transformer";
import { Validate } from "class-validator";
import { ValidFileInputs } from "../../validators/pipeline-validators";
import { InputFile } from "../../../types/input-file";

/* ------------------------------- INSTRUCTION ------------------------------ */

export abstract class InstructionArgsDTO {

    @Expose()
    @Validate(ValidFileInputs)
    public input!: InputFile[];

}

/* -------------------------------- STATEMENT ------------------------------- */

export class StatementArgsDTO {

}