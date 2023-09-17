import { EnumPipelineStepStatus, PipelineStep } from "../../classes/pipeline/pipeline-step";

export class PipelineService {

    public static waitForSteps(steps: PipelineStep[]): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            const promises = [];
            for (const step of steps) {
                promises.push(step.waitForStatus(EnumPipelineStepStatus.ENDED));
            }
            Promise.all(promises).then(() => {
                resolve();
            });
        });
        return promise;
    }

}