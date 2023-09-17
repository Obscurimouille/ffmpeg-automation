import { FileService } from '../utils/file/file.service';
import { v4 as uuidv4 } from 'uuid';

export class RessourceService {

    public static PIPELINE_PATH = './ressources/pipeline.json';
    public static INPUT_DIRECTORY = './ressources/input/';
    public static OUTPUT_DIRECTORY = './ressources/output/';

    /**
     * Get the input pipeline file from the ressources folder.
     * @returns The pipeline file as a string
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

    /**
     * Archive a list of files by copying them to the output directory.
     * @param files The files to archive
     */
    public static archiveFiles(files: string[]): void {
        for (const file of files) {
            RessourceService.archiveFile(file);
        }
    }

    /**
     * Archive a file by copying it to the output directory.
     * @param file The file to archive
     */
    public static archiveFile(file: string): void {
        // Copy the file to the output directory
        const filename = FileService.getFilename(file);
        const outputFilepath = RessourceService.OUTPUT_DIRECTORY + filename;
        FileService.copyFile(file, outputFilepath);
    }

}