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

    // /**
    //  * Resolve the input files from the given paths.
    //  * @param paths The paths to resolve.
    //  * @throws Error if a path is invalid or if no input files are found.
    //  */
    // public static resolveInputFiles(paths: string[]): string[] {
    //     let files = [];
    //     for (let path of paths) {
    //         // The path is a selector
    //         if (path.includes('@')) {
    //             let selectorClass;

    //             try {
    //                 selectorClass = SelectorService.resolve(path);
    //             }
    //             catch (error: any) {
    //                 console.error("Error:", error.message);
    //                 process.exit(1);
    //             }

    //             const selector = new selectorClass(path);
    //             const selectorFiles = selector.resolve();

    //             for (let file of selectorFiles) {
    //                 files.push(file);
    //             }
    //         }

    //         // The path is a normal path
    //         else {
    //             path = RessourceService.INPUT_DIRECTORY + path;
    //             if (!fs.existsSync(path)) {
    //                 throw new Error(`File ${path} not found`);
    //             }
    //             files.push(path);
    //         }
    //     }
    //     return files;
    // }

}