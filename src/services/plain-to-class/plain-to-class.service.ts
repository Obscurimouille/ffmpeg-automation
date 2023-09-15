import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export class ClassTransformService {

    public static readonly DEFAULT_TRANSFORM_OPTIONS: ClassTransformOptions = {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
        enableCircularCheck: true,
    }

    public static plainToClass<T, V>(cls: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T {
        if (!options) options = ClassTransformService.DEFAULT_TRANSFORM_OPTIONS;
        return plainToClass(cls, plain, options);
    }

    /**
     * Validate an instance of a class.
     * @param instance The instance to validate.
     * @param callback The callback to call if errors are found.
     * @returns The validation errors.
     */
    public static validate(instance: any, callback: (errors: ValidationError[]) => void): void {
        validate(instance)
            .then((errors) => {
                if (errors.length) callback(errors);
            })
            .catch((validationError) => {
                throw new Error(`Validation error occurred: ${validationError}`);
            });
    }

}