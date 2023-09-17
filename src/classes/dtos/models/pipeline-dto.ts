import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { StepDTO } from './step-dto';
import { PipelineDTOService } from '../../../services/pipeline/pipeline-dto.service';

/* -------------------------------- PIPELINE -------------------------------- */

export class PipelineDTO {

    @Expose()
    @IsDefined()
    @IsArray()
    @ValidateNested()
    @Type(() => StepDTO)
    @Transform(({value}) => {
        return value.map((element: StepDTO) => PipelineDTOService.toStepChildDTO(element));
    })
    public steps!: StepDTO[];

}