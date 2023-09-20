import { EnumArchiveFilter } from "../../enums/enum-archive-filter";
import { FileService } from "../utils/file/file.service";

export class ArchiveService {

    /**
     * Apply an archive filter to a list of files.
     * @param files The files to filter
     * @param filter The filter to apply (default: ALL)
     * @returns The filtered files
     */
    public static filterFiles(files: string[], filter?: EnumArchiveFilter): string[] {
        switch (filter || EnumArchiveFilter.ALL) {
            case EnumArchiveFilter.ALL: return files;
            case EnumArchiveFilter.VIDEO_ONLY:
                return files.filter(file => FileService.hasVideoExtension(file));
            case EnumArchiveFilter.AUDIO_ONLY:
                return files.filter(file => FileService.hasAudioExtension(file));
            default:
                throw new Error(`Unknown archive filter ${filter}`);
        }
    }

}