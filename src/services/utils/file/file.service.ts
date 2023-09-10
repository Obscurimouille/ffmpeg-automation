import path from 'path';
import fs from 'fs';

export class FileService {

    public static readonly VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
    public static readonly AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a'];

    /**
     * Check if a file has a video extension.
     * @param filename The file name
     * @returns Whether the file has a video extension
     */
    public static hasVideoExtension(filename: string): boolean {
        const extension = FileService.getExtension(filename);
        if (!extension) return false;
        return FileService.VIDEO_EXTENSIONS.includes(extension);
    }

    /**
     * Check if a file has an audio extension.
     * @param filename The file name
     * @returns Whether the file has an audio extension
     */
    public static hasAudioExtension(filename: string): boolean {
        const extension = FileService.getExtension(filename);
        if (!extension) return false;
        return FileService.AUDIO_EXTENSIONS.includes(extension);
    }

    /**
     * Get the extension of a file.
     * @param filename The file name
     * @returns The file extension or undefined if the file has no extension
     * @example getExtension('video.mp4') => '.mp4'
     */
    public static getExtension(filename: string): string | undefined {
        const lastIndex = filename.lastIndexOf('.');
        if (lastIndex !== -1) {
            return filename.slice(lastIndex);
        }
        return undefined;
    }

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
     * @returns The filename
     * @example getFilename('C:/Users/JohnDoe/Desktop/video.mp4') => 'video.mp4'
     */
    public static getFilename(filepath: string): string {
        return path.basename(filepath);
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

            if (!recursive) return callback(filepath);

            // Recursively call the function if the file is a directory
            const stats = fs.statSync(filepath);
            if (stats.isDirectory()) {
                FileService.forEachFile(filepath, callback);
            }
            else callback(filepath);
        }
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
     * @param dirpath The directory path
     */
    public static createDirectory(dirpath: string): void {
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath);
        }
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
        const validFilenameRegex = /^[a-zA-Z0-9_]+\.[a-zA-Z0-9]+$/;
        return validFilenameRegex.test(filename);
    }

}
