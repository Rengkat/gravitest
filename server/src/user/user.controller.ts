import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  BulkCreateUsersDto,
  BulkCreateUsersResponseDto,
} from './dto/create-user.dto';
import {
  UpdateUserDto,
  AdminUpdateUserDto,
  ChangePasswordDto,
  AdminResetPasswordDto,
} from './dto/update-user.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import {
  UserResponseDto,
  CreateUserResponseDto,
} from './dto/user-response.dto';
import { UserService } from './user.service';
import { UserSettingsProvider } from './providers/user-settings.provider';
import { UserNotificationPreferencesProvider } from './providers/user-notification-preferences.provider';
import { DeactivateUserDto } from './dto/admin.dto';
import { DeactivationType, UserRole } from 'src/common/enums/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly userSettingsProvider: UserSettingsProvider,
    private readonly userNotificationPreferencesProvider: UserNotificationPreferencesProvider,
  ) {}

  // ══════════════════════════════════════════
  // SELF — authenticated user's own profile
  // ══════════════════════════════════════════

  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  @ApiOkResponse({ type: UserResponseDto })
  getMe(@UserId() userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update my profile — name, phone, avatar, state, DOB, gender',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error' })
  updateMe(@UserId() userId: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change my password — requires current password' })
  @ApiOkResponse({
    schema: { example: { message: 'Password changed successfully' } },
  })
  @ApiBadRequestResponse({ description: 'Current password is incorrect' })
  changePassword(@UserId() userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate my account' })
  @ApiOkResponse({
    schema: { example: { message: 'Account deactivated successfully' } },
  })
  deactivateMe(@UserId() userId: string) {
    return this.usersService.deactivate(
      userId,
      DeactivationType.USER_REQUEST,
      userId,
      'User requested account deactivation',
    );
  }

  // ── Settings ───────────────────────────────────────────────

  @Get('me/settings')
  @ApiOperation({ summary: 'Get my settings' })
  getSettings(@UserId() userId: string) {
    return this.userSettingsProvider.getSettings(userId);
  }

  @Patch('me/settings')
  @ApiOperation({ summary: 'Update my settings' })
  updateSettings(@UserId() userId: string, @Body() dto: UpdateUserSettingsDto) {
    return this.userSettingsProvider.updateSettings(userId, dto);
  }

  // ── Notification Preferences ───────────────────────────────

  @Get('me/notification-preferences')
  @ApiOperation({ summary: 'Get my notification preferences' })
  getNotificationPreferences(@UserId() userId: string) {
    return this.userNotificationPreferencesProvider.getPreferences(userId);
  }

  @Patch('me/notification-preferences')
  @ApiOperation({ summary: 'Update my notification preferences' })
  updateNotificationPreferences(
    @UserId() userId: string,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.userNotificationPreferencesProvider.updatePreferences(
      userId,
      dto,
    );
  }

  // ══════════════════════════════════════════
  // SUPER ADMIN ONLY
  // ══════════════════════════════════════════

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Create a user directly',
    description:
      'Super admin creates any user type without OTP verification. ' +
      'If password is omitted, a secure temporary password is generated.',
  })
  @ApiCreatedResponse({ type: CreateUserResponseDto })
  @ApiConflictResponse({ description: 'Email already exists' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.adminCreateUser(dto);
  }

  @Post('bulk')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '[Admin] Bulk create up to 500 users in one request',
  })
  @ApiOkResponse({ type: BulkCreateUsersResponseDto })
  bulkCreate(@Body() dto: BulkCreateUsersDto) {
    return this.usersService.bulkCreateUsers(dto);
  }

  @Get()
  @ApiOperation({
    summary: '[Admin] List all users with filters and pagination',
  })
  findAll(@Query() query: UserFilterDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Get a user by ID' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '[Admin] Update any user field including role' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(id, dto);
  }

  @Post(':id/reset-password')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "[Admin] Reset a user's password" })
  adminResetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminResetPasswordDto,
  ) {
    return this.usersService.adminResetPassword(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  adminDeactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DeactivateUserDto,
    @UserId() adminId: string,
  ) {
    return this.usersService.deactivate(
      id,
      dto.type ?? DeactivationType.ADMIN_SUSPENSION,
      adminId,
      dto.reason,
    );
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Reactivate a previously deactivated user' })
  adminReactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.adminUpdateUser(id, { isActive: true });
  }
}
