import { EnumComparator } from "../../enums/enum-comparator";
import { ArchiveService } from "../../services/archive/archive.service";
import { FfmpegService } from "../../services/ffmpeg/ffmpeg.service";
import { FileService } from "../../services/utils/file/file.service";
import { compare } from "./utils";

/**
 * Filter a list of files depending on the parameters.
 * @param files The list of files to filter
 * @param params The parameters
 * @returns The filtered list of files
 */
export async function filter(files: string[], params: any): Promise<string[]> {
    let filteredFiles = files;
    if (params.fileType) filteredFiles = ArchiveService.filterFiles(files, params.fileType);
    else if (params.extensions) filteredFiles = ArchiveService.filterFilesExtensions(files, params.extensions);

    if (params.filenameRegexs) {
        filteredFiles = filterFilenameRegexs(filteredFiles, params.filenameRegexs);
    }
    if (params.matchDuration) {
        filteredFiles = await filterDuration(filteredFiles, params.matchDuration.operator, params.matchDuration.value);
    }

    return filteredFiles;
}

/**
 * Filter a list of files depending on their duration.
 * @param files The list of files to filter
 * @param operator The comparator
 * @param value The value to compare to
 * @returns The filtered list of files
 */
export async function filterDuration(files: string[], operator: EnumComparator, value: number): Promise<string[]> {
    let filteredFiles: string[] = [];
    for (const file of files) {
        const duration = await FfmpegService.getDuration(file);
        if (!duration) continue;
        if (compare(Math.round(duration), operator, value)) {
            filteredFiles.push(file);
        }
    }
    return filteredFiles;
}

/**
 * Filter a list of files with a list of regexs applied to their filename.
 * @param files The list of files to filter
 * @param regexs The list of regexs
 * @returns The filtered list of files
 */
export function filterFilenameRegexs(files: string[], regexs: RegExp[]): string[] {
    // Filter the filenames
    const filteredFiles = files.filter((file) => {
        // Get the filename without extension
        const filename = FileService.getFilename(file, false);
        // Check if the file matches all regexs
        for (const regex of regexs) if (!regex.test(filename)) return false;
        return true;
    });
    return filteredFiles;
}