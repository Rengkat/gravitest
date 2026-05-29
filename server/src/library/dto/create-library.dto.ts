import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsUrl,
  MaxLength,
  Min,
  ArrayUnique,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContentType,
  Subject,
  ExamType,
  ClassLevel,
  SubscriptionTier,
} from 'src/common/enums/enums';

export class CreateLibraryDto {
  @ApiProperty({
    example: 'Complete WAEC Mathematics Guide 2024',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({
    example: 'A comprehensive guide covering all WAEC topics.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  contentType!: ContentType;

  @ApiPropertyOptional({ enum: Subject })
  @IsOptional()
  @IsEnum(Subject)
  subject?: Subject;

  @ApiPropertyOptional({ example: 'Differentiation' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({ example: 'https://cdn.example.com/files/guide.pdf' })
  @IsUrl()
  fileUrl!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumbs/guide.jpg' })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    example: 3600,
    description: 'Duration in seconds (video/audio)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationSeconds?: number;

  @ApiPropertyOptional({
    example: 240,
    description: 'Total pages (ebook/document)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalPages?: number;

  @ApiPropertyOptional({ example: 5242880, description: 'File size in bytes' })
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;

  @ApiPropertyOptional({ enum: ExamType, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(ExamType, { each: true })
  examTypes?: ExamType[];

  @ApiPropertyOptional({ enum: ClassLevel, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(ClassLevel, { each: true })
  classLevels?: ClassLevel[];

  // ── Access control ──────────────────────────────────────────
  @ApiPropertyOptional({
    default: false,
    description: 'True = accessible to all users for free',
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({
    enum: SubscriptionTier,
    description: 'Minimum tier required; null if isFree or pay-per-item',
  })
  @IsOptional()
  @IsEnum(SubscriptionTier)
  requiredTier?: SubscriptionTier;

  @ApiPropertyOptional({
    example: 500000,
    description:
      'One-time purchase price in kobo (₦5,000 = 500000); null if free or tier-gated',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  priceKobo?: number;
}
