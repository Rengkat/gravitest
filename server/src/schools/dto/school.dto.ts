import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsHexColor,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { NigerianState, SchoolType } from 'src/common/enums/enums';

// ─── Create School ────────────────────────────────────────────────────────────

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  subdomain!: string; // e.g. 'kings-college-lagos'

  @IsOptional()
  @IsEnum(SchoolType)
  type?: SchoolType = SchoolType.SECONDARY;

  @IsOptional()
  @IsUrl()
  logoUrl?: string | null;

  @IsOptional()
  @IsHexColor()
  brandColor?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lga?: string | null;

  @IsOptional()
  @IsEnum(NigerianState)
  state?: NigerianState | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string | null;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @IsUrl()
  website?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxStudents?: number = 500;

  // ── First admin user to assign ──
  @IsOptional()
  @IsUUID()
  adminUserId?: string; // assign an existing user as school admin on creation
}

// ─── Update School ────────────────────────────────────────────────────────────

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ─── School Filters ───────────────────────────────────────────────────────────

export class SchoolFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SchoolType)
  type?: SchoolType;

  @IsOptional()
  @IsEnum(NigerianState)
  state?: NigerianState;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsIn(['createdAt', 'name', 'totalStudents', 'state'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

// ─── Create Class ─────────────────────────────────────────────────────────────

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string; // e.g. 'SS2A', 'JSS3B'

  @IsOptional()
  @IsString()
  @MaxLength(50)
  arm?: string | null; // e.g. 'Science', 'Art', 'Commercial'

  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string | null;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(300)
  defaultExamDurationMinutes?: number = 60;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(200)
  defaultQuestionCount?: number = 40;

  // PIN for teacher access (4-6 digits)
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4 to 6 digits' })
  pin!: string;
}

// ─── Update Class ─────────────────────────────────────────────────────────────

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ─── Class Filters ────────────────────────────────────────────────────────────

export class ClassFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsIn(['createdAt', 'name', 'totalStudents', 'totalExamsCreated'])
  sortBy?: string = 'name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

// ─── Rotate Class PIN ─────────────────────────────────────────────────────────

export class RotatePinDto {
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4 to 6 digits' })
  newPin!: string;
}

// ─── Verify Class PIN (teacher login) ────────────────────────────────────────

export class VerifyPinDto {
  @IsString()
  @IsNotEmpty()
  classCode!: string;

  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4 to 6 digits' })
  pin!: string;
}

// ─── Assign School Admin ──────────────────────────────────────────────────────

export class AssignAdminDto {
  @IsUUID()
  userId!: string;
}

// ─── Bulk enroll students ─────────────────────────────────────────────────────

export class BulkEnrollDto {
  @IsUUID('4', { each: true })
  studentProfileIds!: string[];

  @IsOptional()
  @IsUUID()
  schoolClassId?: string;
}
