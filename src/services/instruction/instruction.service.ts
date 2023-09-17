import { ClassConstructor } from "class-transformer";
import { PipelineInstruction } from "../../classes/pipeline/instructions/pipeline-instruction";
import { Segment } from "../../classes/pipeline/instructions/segment/segment";
import { InstructionDTO } from "../../classes/dtos/models/instruction-dto";
import { Split } from "../../classes/pipeline/instructions/split/split";
import { EnumArchiveFilter } from "../../enums/enum-archive-filter";
import { FileService } from "../utils/file/file.service";
import { RessourceService } from "../ressources/ressource.service";
import { ArchiveService } from "../archive/archive.service";

export class InstructionService {

    private static INSTRUCTIONS: ClassConstructor<PipelineInstruction>[] = [
        Segment,
        Split,
    ];

    /**
     * Resolve an instruction model to an instruction class.
     * @param name The instruction name to resolve
     * @returns The instruction class
     */
    public static resolve(name: string): ClassConstructor<PipelineInstruction> {
        const instructionClass = this.INSTRUCTIONS.find((instruction: ClassConstructor<PipelineInstruction>) => name == (instruction as any).IDENTIFIER);
        if (!instructionClass) throw new Error(`Instruction ${name} not found`);
        return instructionClass;
    }

    /**
     * Resolve an instruction model to an instruction class.
     * @param name The instruction name to resolve
     * @returns The instruction class
     */
    public static resolveModel(name: string): ClassConstructor<InstructionDTO> {
        const instructionClass = this.INSTRUCTIONS.find((instruction: ClassConstructor<PipelineInstruction>) => name == (instruction as any).IDENTIFIER);
        if (!instructionClass) throw new Error(`Instruction ${name} not found`);
        return (instructionClass as any).DTO;
    }

    /**
     * Archive a set of files.
     * - The files will be moved to the ressources output directory
     * - The files can be filtered before archiving
     * @param files The files to archive
     * @param filter The filter to apply
     */
    public static archiveFiles(files: string[], filter: EnumArchiveFilter = EnumArchiveFilter.NONE): void {
        // Filter files and archive files
        const filteredFiles = ArchiveService.filterFiles(files, filter);
        RessourceService.archiveFiles(filteredFiles);
    }

}