import { ClassConstructor, ClassTransformOptions, plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export class ClassTransformService {

    private static readonly DEFAULT_TRANSFORM_OPTIONS: ClassTransformOptions = {
        exposeUnsetFields: false,
        enableCircularCheck: true,
    }

    /**
     * Transform a plain object to a class instance.
     * - Prefer using this method over plainToClass as this method will use more suitable options
     * @param cls The class to transform to
     * @param plain The plain object to transform
     * @param options The class transform options (optional)
     * @returns An instance of the class
     */
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
    public static validate(instance: any, callback: (errors: ValidationError[]) => void): Promise<ValidationError[]> {
        return new Promise((resolve, reject) => {
            validate(instance)
            .then((errors) => {
                if (errors.length) callback(errors);
                resolve(errors);
            })
            .catch((validationError) => {
                throw new Error(`Validation error occurred: ${validationError}`);
            });
        });
    }

}