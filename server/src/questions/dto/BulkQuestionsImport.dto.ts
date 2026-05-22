import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from './create-question.dto';

export class BulkImportDto {
  // Applied to every row that doesn't supply its own
  @IsOptional()
  @IsUUID()
  schoolId?: string | null;

  @IsOptional()
  @IsUUID()
  classId?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions!: CreateQuestionDto[];
}

export interface BulkImportResult {
  imported: number;
  failed: number;
  errors: { row: number; reason: string }[];
}
