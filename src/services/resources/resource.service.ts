import { DEFAULT_CONFIG } from '../../default-config';
import { FileService } from '../utils/file/file.service';
import path from "path";

export class ResourceService {

    public static INPUT_DIRECTORY = DEFAULT_CONFIG.inputDir;
    public static OUTPUT_DIRECTORY = DEFAULT_CONFIG.outputDir;

    public static readonly VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'm4v'];
    public static readonly AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a'];
    public static readonly ALL_EXTENSIONS = [...ResourceService.VIDEO_EXTENSIONS, ...ResourceService.AUDIO_EXTENSIONS];

    /**
     * Set the input directory.
     * @param inputDir The input directory path
     */
    public static setInputDirectory(inputDir: string): void {
        ResourceService.INPUT_DIRECTORY = inputDir;
    }

    /**
     * Set the output directory.
     * @param outputDir The output directory path
     */
    public static setOutputDirectory(outputDir: string): void {
        ResourceService.OUTPUT_DIRECTORY = outputDir;
    }

    /**
     * Check if a file has a video extension.
     * @param filename The file name
     * @returns Whether the file has a video extension
     */
    public static hasVideoExtension(filename: string): boolean {
        const extension = FileService.getExtension(filename);
        if (!extension) return false;
        return ResourceService.VIDEO_EXTENSIONS.includes(extension);
    }

    /**
     * Check if a file has an audio extension.
     * @param filename The file name
     * @returns Whether the file has an audio extension
     */
    public static hasAudioExtension(filename: string): boolean {
        const extension = FileService.getExtension(filename);
        if (!extension) return false;
        return ResourceService.AUDIO_EXTENSIONS.includes(extension);
    }

    /**
     * Clear the output directory.
     */
    public static clearOutputDirectory(): void {
        FileService.clearDirectory(ResourceService.OUTPUT_DIRECTORY);
    }

    /**
     * Archive a list of files by copying them to the output directory.
     * @param files The files to archive
     */
    public static archiveFiles(files: string[]): void {
        for (const file of files) {
            ResourceService.archiveFile(file);
        }
    }

    /**
     * Archive a file by copying it to the output directory.
     * @param file The file to archive
     */
    public static archiveFile(file: string): void {
        // Copy the file to the output directory
        const filename = FileService.getFilename(file);
        const outputFilepath = path.join(ResourceService.OUTPUT_DIRECTORY, filename);
        FileService.copyFile(file, outputFilepath);
    }

    /**
     * Get all the input files from the resources folder.
     * @returns The input files
     */
    public static getInputFiles(): string[] {
        return FileService.getFilesInDirectory(ResourceService.INPUT_DIRECTORY);
    }

}