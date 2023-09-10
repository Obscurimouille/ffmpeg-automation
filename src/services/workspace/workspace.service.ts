import { FileService } from "../utils/file/file.service";

export class WorkspaceService {

    public static WORKSPACE_DIRECTORY = './workspace/';

    public static createStepFolder(index: number): string {
        const path = WorkspaceService.WORKSPACE_DIRECTORY + 'step-' + index + '/';
        FileService.createDirectory(path);
        FileService.createDirectory(path + 'input/');
        FileService.createDirectory(path + 'output/');
        return path;
    }

    public static clearWorkspace(): void {
        FileService.clearDirectory(WorkspaceService.WORKSPACE_DIRECTORY);
    }

}