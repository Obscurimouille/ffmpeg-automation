import { InstructionDTO } from "../classes/dtos/models/instruction-dto";

type InstructionMetadata = {
    identifier: string;
    dtoModel: typeof InstructionDTO;
};

export function Instruction(data: InstructionMetadata) {
    return function(decoratedClass: any) {
        decoratedClass['IDENTIFIER'] = data.identifier;
        decoratedClass.prototype['IDENTIFIER'] = data.identifier;

        decoratedClass['DTO_MODEL'] = data.dtoModel;
    }
}