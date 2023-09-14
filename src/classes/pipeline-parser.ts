import 'reflect-metadata';
import { ClassTransformService } from "../services/plain-to-class/plain-to-class.service";
import { ValidationError } from 'class-validator';
import { PipelineDTO } from './dtos/pipeline-dto';

type ErrorCallback = (message: string) => void;

export class PipelineParser {

    private _inputPipeline: string;

    constructor(pipeline: string) {
        this._inputPipeline = pipeline;
    }

    public run(fail: ErrorCallback = () => {}): PipelineDTO {
        // Parse the JSON input pipeline
        const json = this.parseInputPipeline();

        // Instanciate and validate pipeline DTO (without detailed instructions and statements)
        const pipelineDTO = ClassTransformService.plainToClass(PipelineDTO, json!);
        ClassTransformService.validate(pipelineDTO, this.handleValidationError);

        // // Instanciate instructions and statements DTOs
        // pipelineDTO.steps = pipelineDTO.steps.map((step, index) => {
        //     // Instanciate and validate step DTO
        //     const stepDTO = PipelineDTOService.instanciateStepDTO(step);
        //     console.log("stepDTO");
        //     console.log(stepDTO);
        //     ClassTransformService.validate(stepDTO, this.handleValidationError);
        //     return stepDTO;
        // });

        console.log(pipelineDTO);

        for (const step of pipelineDTO.steps) {
            console.log(step);
        }

        return pipelineDTO;
    }

    private handleValidationError(errors: ValidationError[]) {
        console.log("Error in pipeline:");
        for (const error of errors) {
            console.log(ClassTransformService.formatValidationError(error));
        }
        process.exit(1);
    }

    private parseInputPipeline(): object {
        let model;

        try {
            model = JSON.parse(this._inputPipeline) as object;
            if (!model) throw new Error();
        }
        catch (error) {
            fail('Pipeline file is not valid JSON');
        }

        return model;
    }

}