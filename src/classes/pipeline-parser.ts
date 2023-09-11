import { PipelineModelService } from "../services/pipeline-model/pipeline-model.service";
import { PipelineModel } from "../types/pipeline-model";

type ErrorCallback = (message: string) => void;

export class PipelineParser {

    private _inputPipeline: string;

    constructor(pipeline: string) {
        this._inputPipeline = pipeline;
    }

    public run(fail: ErrorCallback = () => {}): PipelineModel {
        let model;

        try {
            model = JSON.parse(this._inputPipeline);
        } catch (error) {
            fail('Pipeline file is not valid JSON');
        }

        try {
            PipelineModelService.castPipelineModel(model);
        }
        catch (error: any) {
            fail('Pipeline file does not conform to Pipeline type: ' + error.message);
        }

        try {
            PipelineModelService.checkIntegrity(model);
        }
        catch (error: any) {
            fail('Pipeline file does not conform to Pipeline type: ' + error.message);
        }

        return model;
    }

}