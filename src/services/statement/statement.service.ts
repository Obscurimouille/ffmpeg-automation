import { ClassConstructor } from "class-transformer";
import { PipelineStatement } from "../../classes/pipeline/statement/pipeline-statement";
import { StatementDTO } from "../../classes/dtos/models/statement-dto";

export class StatementService {

    private static STATEMENTS: ClassConstructor<PipelineStatement>[] = [

    ];

    /**
     * Resolve an statement model to an statement class.
     * @param name The statement name to resolve
     * @returns The statement class
     */
    public static resolve(name: string): ClassConstructor<PipelineStatement> {
        const statementClass = this.STATEMENTS.find((statement: ClassConstructor<PipelineStatement>) => name == (statement as any).IDENTIFIER);
        if (!statementClass) throw new Error(`Statement ${name} not found`);
        return statementClass;
    }

    /**
     * Resolve an statement model to an statement class.
     * @param name The statement name to resolve
     * @returns The statement class
     */
    public static resolveModel(name: string): ClassConstructor<StatementDTO> {
        const statementClass = this.STATEMENTS.find((statement: ClassConstructor<PipelineStatement>) => name == (statement as any).IDENTIFIER);
        if (!statementClass) throw new Error(`Statement ${name} not found`);
        return (statementClass as any).DTO;
    }

}