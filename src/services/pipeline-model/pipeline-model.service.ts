import { EnumInstruction } from '../../enums/enum-instruction';
import { EnumStatement } from '../../enums/enum-statement';
import { PipelineInstructionArgsModel, PipelineInstructionModel, PipelineModel, PipelineStatementArgsModel, PipelineStatementModel, PipelineStepId, PipelineStepModel, StepFileInput } from '../../types/pipeline-model';
import { PipelineInstructionService } from '../pipeline-instruction/pipeline-instruction.service';
import { TypeService } from '../utils/type/type.service';
import { UtilsService } from '../utils/utils';

export class PipelineModelService {

    public static check(model: PipelineModel): boolean {
        return (
            PipelineModelService.checkSyntax(model) &&
            PipelineModelService.checkIntegrity(model)
        );
    }

    /**
     * Check if a given value is a valid PipelineModel syntax.
     * @param model The value to check
     * @returns True if the value is a valid PipelineModel syntax, false otherwise
     */
    public static checkSyntax(model: any): boolean {
        return PipelineModelService.isPipelineModel(model);
    }

    /**
     * Check if a given value is a valid PipelineModel integrity.
     * - Check if the instruction models have valid arguments
     * - Check if the statement models have valid arguments
     * @param model The value to check
     * @returns True if the value is a valid PipelineModel integrity, false otherwise
     */
    public static checkIntegrity(model: any): boolean {
        const steps = model.steps;
        for (const step of steps) {
            if (PipelineModelService.isInstructionModel(step)) {
                if (!PipelineModelService.checkInstructionArgs(step)) {
                    return false;
                }
            }
            if (PipelineModelService.isStatementModel(step)) {
                // Check statement arguments
            }
        }
        return true;
    }

    /**
     * Check if an instruction model matches its args requirements.
     * @param instruction The instruction model to check
     * @returns True if the instruction model has valid arguments, false otherwise
     */
    public static checkInstructionArgs(instruction: PipelineInstructionModel): boolean {
        const instructionClass = PipelineInstructionService.resolve(instruction.instruction);
        return PipelineInstructionService.checkArgsRequirements(instruction.args, instructionClass);
    }

    /**
     * Check if a given value is a valid PipelineModel.
     * @param model The value to check
     * @returns True if the value is a valid PipelineModel, false otherwise
     */
    public static isPipelineModel(model: any): model is PipelineModel {
        return UtilsService.tryPass(() => PipelineModelService.castPipelineModel(model));
    }

    /**
     * Cast a given value to a PipelineModel.
     * @param model The value to cast
     * @returns The casted PipelineModel
     * @throws An error if the given value is not a valid PipelineModel
     */
    public static castPipelineModel(model: any): PipelineModel {
        if (typeof model !== 'object') throw new Error('Pipeline is not an object');
        if (model.steps == undefined) throw new Error('Pipeline steps attribute is not defined');
        if (!Array.isArray(model.steps)) throw new Error('Pipeline steps attribute is not an array');
        model.steps.every((step: any) => PipelineModelService.castStepModel(step));
        return model as PipelineModel;
    }

    /**
     * Check if a given value is a valid PipelineStepModel.
     * @param step The value to check
     * @returns True if the value is a valid PipelineStepModel, false otherwise
     */
    public static isStepModel(step: any): step is PipelineStepModel {
        return UtilsService.tryPass(() => PipelineModelService.castStepModel(step));
    }

    /**
     * Cast a given value to a PipelineStepModel.
     * @param step The value to cast
     * @returns The casted PipelineStepModel
     * @throws An error if the given value is not a valid PipelineStepModel
     */
    public static castStepModel(step: any): PipelineStepModel {
        if (step === undefined) throw new Error('Step is missing');
        if (typeof step !== 'object') throw new Error('Step is not an object: ' + step);

        if (step.instruction !== undefined) {
            PipelineModelService.castInstructionModel(step);
        }
        else if (step.statement !== undefined) {
            PipelineModelService.castStatementModel(step);
        }
        else throw new Error('Step is not a valid step: ' + step);

        return step as PipelineStepModel;
    }

    /**
     * Check if a given value is a valid PipelineInstructionModel.
     * @param instruction The value to check
     * @returns True if the value is a valid PipelineInstructionModel, false otherwise
     */
    public static isInstructionModel(instruction: any): instruction is PipelineInstructionModel {
        return UtilsService.tryPass(() => PipelineModelService.castInstructionModel(instruction));
    }

    /**
     * Cast a given value to a PipelineInstructionModel.
     * @param instruction The value to cast
     * @returns The casted PipelineInstructionModel
     * @throws An error if the given value is not a valid PipelineInstructionModel
     */
    public static castInstructionModel(instruction: any): PipelineInstructionModel {
        if (instruction === undefined) throw new Error('Instruction is missing');
        if (typeof instruction !== 'object') throw new Error('Instruction is not an object: ' + instruction);
        PipelineModelService.castInstructionName(instruction.instruction);
        PipelineModelService.castStepId(instruction.id);
        PipelineModelService.castFilesInputs(instruction.input);
        PipelineModelService.castInstructionArgs(instruction.args);
        return instruction as PipelineInstructionModel;
    }

    /**
     * Check if a given value is a valid PipelineStatementModel.
     * @param statement The value to check
     * @returns True if the value is a valid PipelineStatementModel, false otherwise
     */
    public static isStatementModel(statement: any): statement is PipelineStatementModel {
        return UtilsService.tryPass(() => PipelineModelService.castStatementModel(statement));
    }

    /**
     * Cast a given value to a PipelineStatementModel.
     * @param statement The value to cast
     * @returns The casted PipelineStatementModel
     * @throws An error if the given value is not a valid PipelineStatementModel
     */
    public static castStatementModel(statement: any): PipelineStatementModel {
        if (statement === undefined) throw new Error('Statement is missing');
        if (typeof statement !== 'object') throw new Error('Statement is not an object: ' + statement);
        PipelineModelService.castStatementName(statement.statement);
        PipelineModelService.castStepId(statement.id);
        PipelineModelService.castStatementArgs(statement.args);
        return statement as PipelineStatementModel;
    }

    /**
     * Check if a given value is a valid instruction name.
     * @param name The value to check
     * @returns True if the value is a valid instruction name, false otherwise
     */
    public static isInstructionName(name: any): name is EnumInstruction {
        return UtilsService.tryPass(() => PipelineModelService.castInstructionName(name));
    }

    /**
     * Cast a given value to an instruction name.
     * @param name The value to cast
     * @returns The casted instruction name
     * @throws An error if the given value is not a valid instruction name
     */
    public static castInstructionName(name: any): EnumInstruction {
        if (name === undefined) throw new Error('Instruction name is missing');
        if (typeof name !== 'string') throw new Error('Instruction name is not a string: ' + name);
        if (!Object.values(EnumInstruction).includes(name as EnumInstruction)) throw new Error('Instruction is not a valid instruction: ' + name);
        return name as EnumInstruction;
    }

    /**
     * Check if a given value is a valid statement name.
     * @param name The value to check
     * @returns True if the value is a valid statement name, false otherwise
     */
    public static isStatementName(name: any): name is EnumInstruction {
        return UtilsService.tryPass(() => PipelineModelService.castStatementName(name));
    }

    /**
     * Cast a given value to a statement name.
     * @param name The value to cast
     * @returns The casted statement name
     * @throws An error if the given value is not a valid statement name
     */
    public static castStatementName(name: any): EnumStatement {
        if (name === undefined) throw new Error('Statement name is missing');
        if (typeof name !== 'string') throw new Error('Statement name is not a string: ' + name);
        if (!Object.values(EnumStatement).includes(name as EnumStatement)) throw new Error('Statement is not a valid statement: ' + name);
        return name as EnumStatement;
    }

    /**
     * Check if a given value is a valid PipelineStepInput.
     * @param input The value to check
     * @returns True if the value is a valid PipelineStepInput, false otherwise
     */
    public static isFilesInputs(inputs: any): inputs is StepFileInput[] {
        return UtilsService.tryPass(() => PipelineModelService.castFilesInputs(inputs));
    }

    /**
     * Cast a given value to a PipelineStepInput.
     * @param input The value to cast
     * @returns The casted PipelineStepInput
     */
    public static castFilesInputs(inputs: any): StepFileInput[] {
        if (inputs === undefined) throw new Error('Step inputs is missing');
        if (!Array.isArray(inputs)) throw new Error('Step inputs is not an array: ' + inputs);
        if (!TypeService.isStringArray(inputs)) throw new Error('Step inputs is not an array of strings: ' + inputs);
        return inputs as StepFileInput[];
    }

    /**
     * Check if a given value is a valid PipelineInstructionArgs.
     * @param args The value to check
     * @returns True if the value is a valid PipelineInstructionArgs, false otherwise
     */
    public static isInstructionArgs(args: any): args is PipelineInstructionArgsModel {
        return UtilsService.tryPass(() => PipelineModelService.castInstructionArgs(args));
    }

    /**
     * Cast a given value to a PipelineInstructionArgs.
     * @param args The value to cast
     * @returns The casted PipelineInstructionArgs
     * @throws An error if the given value is not a valid PipelineInstructionArgs
     */
    public static castInstructionArgs(args: any): PipelineInstructionArgsModel {
        if (args !== undefined && typeof args !== 'object') throw new Error('Instruction args is not an object: ' + args);
        return args as PipelineStatementArgsModel;
    }

    /**
     * Check if a given value is a valid PipelineStatementArgs.
     * @param args The value to check
     * @returns True if the value is a valid PipelineStatementArgs, false otherwise
     */
    public static isStatementArgs(args: any): args is PipelineStatementArgsModel {
        return UtilsService.tryPass(() => PipelineModelService.castStatementArgs(args));
    }

    /**
     * Cast a given value to a PipelineStatementArgs.
     * @param args The value to cast
     * @returns The casted PipelineStatementArgs
     * @throws An error if the given value is not a valid PipelineStatementArgs
     */
    public static castStatementArgs(args: any): PipelineStatementArgsModel {
        if (args !== undefined && typeof args !== 'object') throw new Error('Statement args is not an object: ' + args);
        return args as PipelineStatementArgsModel;
    }

    /**
     * Check if a given value is a valid PipelineStepId.
     * @param id The value to check
     * @returns True if the value is a valid PipelineStepId, false otherwise
     */
    public static isStepId(id: any): id is PipelineStepId {
        return UtilsService.tryPass(() => PipelineModelService.castStepId(id));
    }

    /**
     * Cast a given value to a PipelineStepId.
     * @param id The value to cast
     * @returns The casted PipelineStepId
     * @throws An error if the given value is not a valid PipelineStepId
     */
    public static castStepId(id: any): PipelineStepId {
        if (id === undefined) throw new Error('Step id is missing');
        if (typeof id !== 'number') throw new Error('Step id is not a number: ' + id);
        if (id <= 0) throw new Error('Step id must be positive: ' + id);
        return id as PipelineStepId;
    }

}
