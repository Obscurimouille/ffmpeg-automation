import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { StepDTO } from './step-dto';
import { ClassTransformService } from '../../services/plain-to-class/plain-to-class.service';
import { EnumInstruction } from '../../enums/enum-instruction';
import { EnumStepType } from '../../enums/enum-step-type';
import { SegmentDTO } from '../instructions/segment/segment-model';

/* -------------------------------- PIPELINE -------------------------------- */

export class PipelineDTO {

    @Expose()
    @IsDefined()
    @IsArray()
    @ValidateNested()
    @Type(() => StepDTO)
    @Transform(({value}) => {
        return value.map((element: StepDTO) => {
            switch (element.type) {
                case EnumStepType.INSTRUCTION:
                    switch (element.name) {
                        case EnumInstruction.SEGMENT: return ClassTransformService.plainToClass(SegmentDTO, element);
                        default: throw new Error("Unknown instruction");
                    }
                case EnumStepType.STATEMENT: throw new Error("Statements are not implemented yet");
                default: throw new Error("Unknown step type");
            }
        });
    })
    public steps!: StepDTO[];

}