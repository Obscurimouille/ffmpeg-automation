import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isNumber, isString } from "class-validator";
import { UtilsService } from "../../services/utils/utils";
import { EnumInstruction } from "../../enums/enum-instruction";
import { EnumStatement } from "../../enums/enum-statement";
import { EnumStepType } from "../../enums/enum-step-type";

export function removeDTOFromClassName(className: string) {
    return className.replace(/DTO$/, '');
}

@ValidatorConstraint()
export class ValidStepType implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumStepType);
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: '$value' is not a valid step type!`;
    }
}

@ValidatorConstraint()
export class ValidStepName implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return UtilsService.isPartOfEnum(value, EnumInstruction) || UtilsService.isPartOfEnum(value, EnumStatement);
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: '$value' is not a valid step name!`;
    }
}

@ValidatorConstraint()
export class ValidId implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return isNumber(value) && value > 0;
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: ${args.value} is not a valid id!\n`;
    }
}

@ValidatorConstraint()
export class ValidInputFile implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return isString(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${removeDTOFromClassName(args.targetName)}: invalid inputs!`;
    }
}