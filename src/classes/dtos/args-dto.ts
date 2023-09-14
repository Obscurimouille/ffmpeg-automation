import { Expose } from "class-transformer";
import { IsDefined, Validate } from "class-validator";
import { ValidFileInputs } from "../validators/step-validators";
import { InputFile } from "../../types/input-file";

/* ------------------------------- INSTRUCTION ------------------------------ */

export abstract class InstructionArgsDTO {

    @Expose()
    @IsDefined()
    @Validate(ValidFileInputs)
    public input!: InputFile[];

}

/* -------------------------------- STATEMENT ------------------------------- */

export class StatementArgsDTO {

}