import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, isArray, isNumber, isString } from "class-validator";
import { EnumInstruction } from "../../../enums/enum-instruction";
import { UtilsService } from "../../../services/utils/utils";
import { EnumStatement } from "../../../enums/enum-statement";
import { EnumStepType } from "../../../enums/enum-step-type";
import { FileService } from "../../../services/utils/file/file.service";
import { SelectorService } from "../../../services/selector/selector.service";

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
 * @param value The value to validate
 * @returns True if the value is valid, false otherwise
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
 * @param value The value to validate
 * @returns True if the value is valid, false otherwise
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
 * @param value The value to validate
 * @returns True if the value is valid, false otherwise
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
 * @param value The value to validate
 * @returns True if the value is valid, false otherwise
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
 * @param value The value to validate
 * @returns True if the value is valid, false otherwise
 */
@ValidatorConstraint()
export class ValidId implements ValidatorConstraintInterface, Parse {

    parse(value: any, args: ValidationArguments): ParseResult {
        if (value === undefined) return { success: false, message: `id is not defined!` };
        if (!isNumber(value)) return { success: false, message: `${value} is not a valid id!` };
        if (value <= 0) return { success: false, message: `id must be a positive number!` };
        return { success: true };
    }

    validate(value: any, args: ValidationArguments): boolean {
        const { success } = this.parse(value, args);
        return success;
    }

    defaultMessage(args: ValidationArguments) {
        const { message } = this.parse(args.value, args);
        return message + '\n';
    }
}

/**
 * Validate if the file input is valid.
 * - The file input must be a string
 * - The file input must not be empty
 * @param value The value to validate
 * @returns True if the value is valid, false otherwise
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
        return message + '\n';
    }
}