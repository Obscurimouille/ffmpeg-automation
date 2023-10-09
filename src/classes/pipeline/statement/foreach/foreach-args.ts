import { Expose, Transform, Type } from "class-transformer";
import { StatementArgsDTO } from "../../../dtos/models/args-dto";
import { IsArray, IsDefined, Validate, ValidateNested } from "class-validator";
import { ValidFileInputs } from "../../../../modules/validators/pipeline-validators";
import { InputFile } from "../../../../types/input-file";
import { StepDTO } from "../../../dtos/models/step-dto";
import { PipelineDTOService } from "../../../../services/pipeline/pipeline-dto.service";

export class ForeachArgsDTO extends StatementArgsDTO {

    @Expose()
    @IsDefined()
    @Validate(ValidFileInputs)
    public input!: InputFile[];

    @Expose()
    @IsArray()
    @ValidateNested()
    @Type(() => StepDTO)
    @Transform(({value}) => {
        // TODO: The property 'steps' is not checked before transformation.
        return value.map((element: StepDTO) => PipelineDTOService.toStepChildDTO(element));
    })
    public steps!: StepDTO[];

}