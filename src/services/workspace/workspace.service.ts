import { DEFAULT_CONFIG } from "../../default-config";
import { FileService } from "../utils/file/file.service";
import path from "path";

export class WorkspaceService {

    public static WORKSPACE_DIRECTORY = DEFAULT_CONFIG.workspaceDir;

    /**
     * Set the workspace directory.
     * @param workspaceDir The workspace directory path
     */
    public static setWorkspaceDirectory(workspaceDir: string): void {
        WorkspaceService.WORKSPACE_DIRECTORY = workspaceDir;
    }

    /**
     * Create a new step folder in the workspace directory.
     * @param id The id of the step
     * @returns The path of the created folder
     */
    public static createStepFolder(id: number): string {
        const dirpath = path.join(WorkspaceService.WORKSPACE_DIRECTORY, `step-${id}`);
        // If the folder already exists, clear it
        if (FileService.directoryExists(dirpath)) {
            FileService.clearDirectory(dirpath);
        }
        FileService.createDirectory(dirpath);
        FileService.createDirectory(path.join(dirpath, 'input'));
        FileService.createDirectory(path.join(dirpath, 'output'));
        return dirpath;
    }

    /**
     * Clear the workspace directory.
     * - This will delete all the files in the workspace directory.
     */
    public static clearWorkspace(): void {
        FileService.clearDirectory(WorkspaceService.WORKSPACE_DIRECTORY);
    }

}