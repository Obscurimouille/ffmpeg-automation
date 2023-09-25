import { StatementDTO } from '../classes/dtos/models/statement-dto';

type StatementMetadata = {
    identifier: string;
    dtoModel: typeof StatementDTO;
};

export function Statement(data: StatementMetadata) {
    return function (decoratedClass: any) {
        decoratedClass['IDENTIFIER'] = data.identifier;
        decoratedClass.prototype['IDENTIFIER'] = data.identifier;

        decoratedClass['DTO_MODEL'] = data.dtoModel;
    };
}
