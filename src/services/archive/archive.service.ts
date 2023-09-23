import { EnumFileTypeFilter } from "../../enums/enum-file-type-filter";
import { ResourceService } from "../resources/resource.service";
import { FileService } from "../utils/file/file.service";

export class ArchiveService {

    /**
     * Apply an archive filter to a list of files.
     * @param files The files to filter
     * @param filter The filter to apply (default: ALL)
     * @returns The filtered files
     */
    public static filterFiles(files: string[], filter?: EnumFileTypeFilter): string[] {
        switch (filter || EnumFileTypeFilter.ALL) {
            case EnumFileTypeFilter.ALL: return files;
            case EnumFileTypeFilter.VIDEOS:
                return files.filter(file => ResourceService.hasVideoExtension(file));
            case EnumFileTypeFilter.AUDIOS:
                return files.filter(file => ResourceService.hasAudioExtension(file));
            default:
                throw new Error(`Unknown archive filter ${filter}`);
        }
    }

    /**
     * Apply an extensions filter to a list of files.
     * @param files The files to filter
     * @param extensions The extensions to filter
     */
    public static filterFilesExtensions(files: string[], extensions: string[]): string[] {
        return files.filter(file => extensions.includes(FileService.getExtension(file)!));
    }

}