import path from 'path';
import fs from 'fs';

export class FileService {

    // /**
    //  * Rename a filename in a file path.
    //  * @param filepath The file path
    //  * @param newFilename The new filename
    //  * @returns The file path with the new filename
    //  * @example renameFilename('C:/foo/video.mp4', 'newVideo.mp4') => 'C:/foo/newVideo.mp4'
    //  */
    // public static renameFilename(filepath: string, newFilename: string): string {
    //     const dirpath = path.dirname(filepath);
    //     return dirpath + '/' + newFilename;
    // }

    /**
     * Get the extension of a file.
     * @param filename The file name
     * @returns The file extension or undefined if the file has no extension
     * @example getExtension('video.mp4') => 'mp4'
     */
    public static getExtension(filename: string): string | undefined {
        const extension = filename.split('.').pop();
        return extension;
    }

    /**
     * Copy a file to a new location.
     * @param source The source file path
     * @param destination The destination file path
     */
    public static copyFile(source: string, destination: string): void {
        fs.copyFileSync(source, destination);
    }

    /**
     * Relocate files to a new directory.
     * @param filepaths The file paths to relocate
     * @param outputDir The directory to relocate the files to
     * @returns The new file paths
     * @example relocateFiles(['C:/foo/video.mp4'], 'F:/bar/') => ['F:/bar/video.mp4']
     */
    public static relocateFiles(filepaths: string[], outputDir: string): string[] {
        let newPaths: string[] = [];

        for (let filepath of filepaths) {
            const filename = FileService.getFilename(filepath);
            const newLocation = outputDir + filename;

            FileService.copyFile(filepath, newLocation);
            // Update the new value of the input
            newPaths.push(newLocation);
        }

        return newPaths;
    }

    /**
     * Get the filename of a file path.
     * @param filepath The file path
     * @param keepExtension Whether to keep the extension (default: true)
     * @returns The filename
     * @example getFilename('C:/Users/JohnDoe/Desktop/video.mp4') => 'video.mp4'
     */
    public static getFilename(filepath: string, keepExtension: boolean = true): string {
        const filename = path.basename(filepath);
        if (keepExtension) return filename;
        return filename.split('.')[0];
    }

    /**
     * Loop through all files in a directory and its subdirectories.
     * @param dirpath The directory path
     * @param callback The callback function to call for each file
     * @param recursive Whether to loop through subdirectories
     */
    public static forEachFile(dirpath: string, callback: (filepath: string) => void, recursive: boolean = false): void {
        const files = fs.readdirSync(dirpath);
        for (const file of files) {
            const filepath = dirpath + file;

            if (!recursive) {
                callback(filepath);
                continue;
            }

            // Recursively call the function if the file is a directory
            const stats = fs.statSync(filepath);
            if (stats.isDirectory()) {
                FileService.forEachFile(filepath, callback);
            }
            else callback(filepath);
        }
    }

    /**
     * Get all files in a directory and its subdirectories.
     * @param dirpath The directory path
     * @param recursive Whether to loop through subdirectories (default: false)
     * @returns The list of files
     */
    public static getFilesInDirectory(dirpath: string, recursive: boolean = false): string[] {
        let files: string[] = [];

        FileService.forEachFile(dirpath, (filepath) => {
            files.push(filepath);
        }, recursive);

        return files;
    }

    /**
     * Create a file with the given content.
     * @param filepath The file path
     * @param content The file content
     */
    public static createFile(filepath: string, content: string): void {
        fs.writeFileSync(filepath, content);
    }

    /**
     * Get the content of a file.
     * @param filepath The file path
     * @returns The file content
     */
    public static getFile(filepath: string): string | null {
        if (!fs.existsSync(filepath)) {
            return null;
        }

        return fs.readFileSync(filepath, 'utf8');
    }

    /**
     * Create a directory.
     * - If the directory already exists, do nothing.
     * - Create all parent directories if they don't exist.
     * @param dirpath The directory path
     */
    public static createDirectory(dirpath: string): void {
        // Split the directory path into an array of directories
        const normalizedPath = path.normalize(dirpath);
        const dirs = normalizedPath.split(path.sep).filter(dir => dir !== '');
        let currentPath = '';
        // Loop through each directory and create it if it doesn't exist
        for (const dir of dirs) {
            currentPath = path.join(currentPath, dir);
            if (!FileService.directoryExists(currentPath)) {
                fs.mkdirSync(currentPath);
            }
        }

    }

    /**
     * Check if a directory exists.
     * @param dirpath The directory path
     * @returns Whether the directory exists
     */
    public static directoryExists(dirpath: string): boolean {
        return fs.existsSync(dirpath);
    }

    /**
     * Clear a directory by removing all its files and subdirectories.
     * @param dirpath The directory path
     */
    public static clearDirectory(dirpath: string): void {
        try {
            // Get a list of all files and subdirectories in the workspace directory
            const files = fs.readdirSync(dirpath);

            // Loop through each file and subdirectory
            for (const file of files) {
                const filepath = path.join(dirpath, file);

                // Check if it's a file or directory
                const stats = fs.statSync(filepath);
                // If it's a directory, recursively call the function to remove its contents and then delete the directory
                if (stats.isDirectory()) {
                    FileService.clearDirectory(filepath);
                    fs.rmdirSync(filepath);
                }
                // If it's a file, simply delete it
                else {
                    fs.unlinkSync(filepath);
                }
            }
        }
        catch (error) {
            throw new Error(`Error clearing ${dirpath} : ${error}`);
        }
    }

    /**
     * Check if a path has a valid format.
     * @param path The path to check
     * @returns Whether the path is valid
     */
    public static isValidPath(path: any): boolean {
        if (typeof path !== 'string') return false;
        const validPathRegex = /^[a-zA-Z0-9\/_.-]+$/;
        return validPathRegex.test(path);
    }

    /**
     * Check if a filename has a valid format.
     * @param filename The filename to check
     * @returns Whether the filename is valid
     */
    public static isValidFilename(filename: any): boolean {
        if (typeof filename !== 'string') return false;
        const validFilenameRegex = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
        return validFilenameRegex.test(filename);
    }

}
