import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsIn,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DifficultyLevel,
  ExamType,
  QuestionType,
  Subject,
} from 'src/common/enums/enums';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

// ─── Update (all fields optional) ────────────────────────────────────────────

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

// ─── Filter / query params for GET /questions ────────────────────────────────

export class QuestionFiltersDto extends PaginationDto {
  @IsString()
  @IsOptional()
  questionNumber: string; //for theory questions e.g Question 1a, 1b etc

  @IsOptional()
  @IsEnum(ExamType)
  examType?: ExamType;

  @IsOptional()
  @IsEnum(Subject)
  subject?: Subject;

  @IsOptional()
  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficulty?: DifficultyLevel;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  /** null = platform-only, a UUID = school-specific, omit = all */
  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsUUID()
  classId?: string;

  // Search
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['createdAt', 'year', 'difficulty', 'examType', 'subject'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

// ─── Bulk toggle active status ────────────────────────────────────────────────

export class BulkToggleDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];

  @IsBoolean()
  isActive!: boolean;
}

// ─── Bulk delete ──────────────────────────────────────────────────────────────

export class BulkDeleteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}
