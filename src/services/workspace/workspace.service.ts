import { FileService } from "../utils/file/file.service";

export class WorkspaceService {

    public static WORKSPACE_DIRECTORY = './workspace/';

    /**
     * Create a new step folder in the workspace directory.
     * @param index The index of the step
     * @returns The path of the created folder
     */
    public static createStepFolder(index: number): string {
        const path = WorkspaceService.WORKSPACE_DIRECTORY + `step-${index}/`;
        FileService.createDirectory(path);
        FileService.createDirectory(path + 'input/');
        FileService.createDirectory(path + 'output/');
        return path;
    }

    /**
     * Clear the workspace directory.
     * - This will delete all the files in the workspace directory.
     */
    public static clearWorkspace(): void {
        FileService.clearDirectory(WorkspaceService.WORKSPACE_DIRECTORY);
    }

}