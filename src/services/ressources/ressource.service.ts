import { FileService } from '../utils/file/file.service';

export class RessourceService {

    public static PIPELINE_PATH = './ressources/pipeline.json';
    public static INPUT_DIRECTORY = './ressources/input/';
    public static OUTPUT_DIRECTORY = './ressources/output/';

    /**
     * Get the pipeline from the ressources folder.
     */
    public static getPipeline(): string | null {
        return FileService.getFile(RessourceService.PIPELINE_PATH);
    }

    /**
     * Clear the output directory.
     */
    public static clearOutputDirectory(): void {
        FileService.clearDirectory(RessourceService.OUTPUT_DIRECTORY);
    }
    
}