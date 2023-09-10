import { PipelineInstructionRequirements } from "../../types/pipeline-instructions-requirements";
import { FileService } from "../utils/file/file.service";

export class PipelineInstructionRequirementsService {

    public static checkRequirements(requirements: PipelineInstructionRequirements, inputFiles: string[]): void {
        // Check number of input files
        if (requirements.input.nbFiles) {
            if (inputFiles.length !== requirements.input.nbFiles) {
                throw new Error(`requires ${requirements.input.nbFiles} input files but ${inputFiles.length} were provided`);
            }

            // Check if input files are video only
            if (requirements.input.videoOnly) {
                for (const file of inputFiles) {
                    if (!FileService.hasVideoExtension(file)) {
                        throw new Error(`requires video files only but ${file} is not a video file`);
                    }
                }
            }

            if (requirements.input.videoOnly) {
                for (const file of inputFiles) {
                    if (!FileService.hasVideoExtension(file)) {
                        throw new Error(`requires video files only but ${file} is not an audio file`);
                    }
                }
            }
        }
    }

}