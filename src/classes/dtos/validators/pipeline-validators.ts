import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, isArray, isNumber, isString, ValidationOptions, registerDecorator } from "class-validator";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { UtilsService } from "../../../services/utils/utils";
import { EnumStatement } from "../../../enums/enum-statement";
import { EnumStepType } from "../../../enums/enum-step-type";
import { FileService } from "../../../services/utils/file/file.service";
import { SelectorService } from "../../../services/selector/selector.service";
import { PipelineParserService } from "../../../services/pipeline/pipeline-parser.service";

interface Parse {
    parse(value: any, args: ValidationArguments): ParseResult;
}

type ParseResult = {
    success: boolean,
    message?: string
}

/**
 * Validate if the step type is valid.
 * - The step type must be part of the EnumStepType enum
 */
@ValidatorConstraint()
export class ValidStepType implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumStepType);
    }

    defaultMessage(args: ValidationArguments) {
        return `'$value' is not a valid step type!`;
    }
}

/**
 * Validate if the step name is valid.
 * - The step name must be part of the EnumInstruction or EnumStatement enum
 */
@ValidatorConstraint()
export class ValidStepName implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumInstruction) || UtilsService.isPartOfEnum(value, EnumStatement);
    }

    defaultMessage(args: ValidationArguments) {
        return `'$value' is not a valid step name!`;
    }
}

/**
 * Validate if the instruction name is valid.
 * - The instruction name must be part of the EnumInstruction enum
 */
@ValidatorConstraint()
export class ValidInstructionName implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumInstruction);
    }

    defaultMessage(args: ValidationArguments) {
        return `'$value' is not a valid instruction!`;
    }
}

/**
 * Validate if the statement name is valid.
 * - The statement name must be part of the EnumStatement enum
 */
@ValidatorConstraint()
export class ValidStatementName implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumStatement);
    }

    defaultMessage(args: ValidationArguments) {
        return `'$value' is not a valid statement!`;
    }
}

/**
 * Validate if the id is valid.
 * - The id must be a number
 * - The id must be greater than 0
 * - The id must not be already used
 */
@ValidatorConstraint()
export class ValidId implements ValidatorConstraintInterface, Parse {

    parse(value: any, args: ValidationArguments): ParseResult {
        if (value === undefined) return { success: false, message: `id is not defined!` };
        if (!isNumber(value)) return { success: false, message: `${value} is not a valid id!` };
        if (value <= 0) return { success: false, message: `id must be a positive number!` };

        // Check if the id is already used
        const parserService = PipelineParserService.getInstance();
        if (parserService.isIdAlreadyUsed(value)) return { success: false, message: `id ${value} is already used!` };
        parserService.addValidateId(value);

        return { success: true };
    }

    validate(value: any, args: ValidationArguments): boolean {
        const { success } = this.parse(value, args);
        return success;
    }

    defaultMessage(args: ValidationArguments) {
        const { message } = this.parse(args.value, args);
        return message || '';
    }
}

/**
 * Validate if the file input is valid.
 * - The file input must be a string
 * - The file input must not be empty
 */
@ValidatorConstraint()
export class ValidFileInputs implements ValidatorConstraintInterface, Parse {

    parse(value: any, args: ValidationArguments): ParseResult {
        const options = args.constraints ? args.constraints[0] : {};

        // Check if the value is defined
        if (value === undefined) return { success: false, message: `input is not defined!` };

        // Check if the value is an array
        if (!isArray(value)) return { success: false, message: `input must be an array!` };

        // Check if the array meets the min/max requirements
        if (options.min != undefined) {
            if (value.length < options.min) return { success: false, message: `not enough input files! ${options.min} required` };
        }
        if (options.max != undefined) {
            if (value.length > options.max) return { success: false, message: `too many input files! ${options.max} allowed` };
        }

        // Check if every element in the array is valid
        for (const input of value) {
            if (typeof input !== 'string') return { success: false, message: `input items must be a string!` };

            if (!FileService.isValidFilename(input) && !SelectorService.isSelector(input)) {
                return { success: false, message: `invalid input file: ${input}` };
            }

            if (options.videoOnly) {
                if (!SelectorService.isSelector(input) && !FileService.hasVideoExtension(input)) {
                    return { success: false, message: `input file must be a video: ${input}` };
                }
            }

            if (options.audioOnly) {
                if (!SelectorService.isSelector(input) && !FileService.hasAudioExtension(input)) {
                    return { success: false, message: `input file must be an audio: ${input}` };
                }
            }
        }

        return { success: true };
    }

    validate(value: any, args: ValidationArguments): boolean {
        const { success } = this.parse(value, args);
        return success;
    }

    defaultMessage(args: ValidationArguments) {
        const { message } = this.parse(args.value, args);
        return message || '';
    }
}

/**
 * Set a value as optional.
 * - If the value is defined, return true
 * - Else, it returns false
 * - You can specify other values that must be defined for the value to be optional
 * For example, if you specify { includeAll: ['a', 'b'] }, the value will be optional only if a and b are defined
 * If you specify { includeAny: ['c', 'd'] }, the value will be optional only if c or d is defined
 */
@ValidatorConstraint()
export class Optional implements ValidatorConstraintInterface, Parse {

    parse(value: any, args: ValidationArguments): ParseResult {
        const options = args.constraints ? args.constraints[0] : null;

        if (options === undefined || !Object.entries(options).length) {
            return value === undefined ? { success: false, message: `value is not defined!` } : { success: true };
        }

        if (options.includeAll && (!isArray(options.includeAll) || options.includeAll.length === 0)) {
            throw new Error(`"Optional" validator: "includeAll" option must be an array with at least one element!`);
        }

        // If the value is defined, return true
        if (value !== undefined) return { success: true };

        // Else, check if all other values are defined
        for (const key of options.includeAll) {
            if ((args.object as any)[key] === undefined) {
                return { success: false, message: `at least one of the following options must be defined: ${options.includeAll}` };
            }
        }

        return { success: true };
    }

    validate(value: any, args: ValidationArguments): boolean {
        const { success } = this.parse(value, args);
        return success;
    }

    defaultMessage(args: ValidationArguments) {
        const { message } = this.parse(args.value, args);
        return message || '';
    }
}