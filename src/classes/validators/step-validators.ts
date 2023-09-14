import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, isArray } from "class-validator";
import { EnumInstruction } from "../../enums/enum-instruction";
import { UtilsService } from "../../services/utils/utils";
import { removeDTOFromClassName } from "./pipeline-validators";
import { EnumStatement } from "../../enums/enum-statement";

@ValidatorConstraint()
export class ValidInstructionName implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumInstruction);
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: '$value' is not a valid instruction!`;
    }
}

@ValidatorConstraint()
export class ValidStatementName implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumStatement);
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: '$value' is not a valid statement!`;
    }
}

@ValidatorConstraint()
export class ValidFileInputs implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
        const options = args.constraints ? args.constraints[0] : {};

        // Check if the value is an array
        if (!isArray(value)) return false;

        // Check if the array meets the min/max requirements
        if (options.min != undefined) {
            if (value.length < options.min) return false;
        }
        if (options.max != undefined) {
            if (value.length > options.max) return false;
        }

        // Check if every element in the array is a string
        return value.every((element: any) => typeof element === 'string' && element.length > 0);
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: invalid arguments!`;
    }
}