import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import {
  DifficultyLevel,
  ExamType,
  QuestionType,
  Subject,
} from 'src/common/enums/enums';

// ─── Option ──────────────────────────────────────────────────────────────────

export class CreateOptionDto {
  @IsIn(['A', 'B', 'C', 'D'])
  label!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string | null;

  @IsInt()
  @Min(0)
  order!: number;
}

// ─── Answer ───────────────────────────────────────────────────────────────────

export class CreateAnswerDto {
  @IsIn(['A', 'B', 'C', 'D'])
  correctLabel!: string;

  // correctOptionId is resolved server-side after options are inserted;
  // the client sends the label, not the UUID.
}

// ─── Explanation ─────────────────────────────────────────────────────────────

export class CreateExplanationDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string | null;

  @IsOptional()
  @IsUrl()
  videoUrl?: string | null;
}

// ─── Main DTO ─────────────────────────────────────────────────────────────────

export class CreateQuestionDto {
  @IsString()
  @IsOptional()
  questionNumber: string; //for theory questions e.g Question 1a, 1b etc

  @IsEnum(ExamType)
  examType!: ExamType;

  @IsEnum(Subject)
  subject!: Subject;

  @IsInt()
  @Min(1990)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @IsString()
  @IsNotEmpty()
  questionText!: string;

  @IsOptional()
  @IsUrl()
  questionImageUrl?: string | null;

  @IsEnum(DifficultyLevel)
  difficulty!: DifficultyLevel;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsOptional()
  @IsString()
  topic?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // MCQ-only fields
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAnswerDto)
  answer?: CreateAnswerDto;

  // Explanations (at least one recommended for published questions)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExplanationDto)
  explanations?: CreateExplanationDto[];

  // School-specific question (null = platform-wide question)
  @IsOptional()
  @IsUUID()
  schoolId?: string | null;

  @IsOptional()
  @IsUUID()
  classId?: string | null;
}
