import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { QueryLibraryDto } from './dto/query-library.dto';
import { RecordAccessDto } from './dto/record-access.dto';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/enums/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AccessCheckResult } from './types/library.interfaces';
import { UserId } from 'src/auth/decorators/current-user.decorator';

@ApiTags('Library')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  @ApiOperation({
    summary: 'Browse content catalogue',
    description:
      'Retrieve a paginated, filterable catalogue of published library content. Results are tailored based on user subscription tier.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by title, description, or tags',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by content type (e.g., video, document, quiz)',
    example: 'video',
  })
  @ApiQuery({
    name: 'subject',
    required: false,
    description: 'Filter by subject',
    example: 'mathematics',
  })
  @ApiQuery({
    name: 'examType',
    required: false,
    description: 'Filter by exam type',
    example: 'waec',
  })
  @ApiQuery({
    name: 'access',
    required: false,
    description: 'Filter by access level (free, premium, subscribed)',
    example: 'premium',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort field',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort direction (ASC/DESC)',
    example: 'DESC',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Content catalogue retrieved successfully',
  })
  findAll(@Query() query: QueryLibraryDto, @Request() req: any) {
    return this.libraryService.findAll(query, req.user?.subscriptionTier);
  }

  @Get('me/library')
  @ApiOperation({
    summary: "Get current user's library",
    description:
      'Retrieve all content that the current user has purchased or has subscription access to. Includes progress and bookmark information.',
  })
  @ApiResponse({
    status: 200,
    description: 'User library retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  getUserLibrary(@UserId() userId: string) {
    return this.libraryService.getUserLibrary(userId);
  }

  @Get('admin/all')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] List all content including drafts',
    description:
      'Retrieve all library content including unpublished drafts. Only accessible by Super Admins.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by title, description, or tags',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by content type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status (draft, published, archived)',
    example: 'draft',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Admin content list retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  findAllAdmin(@Query() query: QueryLibraryDto) {
    return this.libraryService.findAllAdmin(query);
  }

  @Get('admin/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Platform-wide library statistics',
    description:
      'Get comprehensive statistics about library usage including total content, views, access patterns, and popular items.',
  })
  @ApiResponse({
    status: 200,
    description: 'Library statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalContent: { type: 'number', example: 1250 },
        publishedContent: { type: 'number', example: 1100 },
        totalAccessGrants: { type: 'number', example: 5000 },
        popularContent: { type: 'array', items: { type: 'object' } },
        accessByType: { type: 'object' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  getStats() {
    return this.libraryService.getStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single content item metadata',
    description:
      'Retrieve metadata for a specific content item. File URLs are withheld if user does not have access.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Content metadata retrieved successfully',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.findOne(id);
  }

  @Get(':id/access')
  @ApiOperation({
    summary: 'Check access to content',
    description:
      'Check if the current user has access to a specific content item. Returns access status and reason if denied.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiOkResponse({
    description: 'Access check result',
    schema: {
      type: 'object',
      properties: {
        hasAccess: { type: 'boolean', example: true },
        reason: {
          type: 'string',
          description: 'Reason if access is denied',
          example: 'Premium subscription required',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  checkAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<AccessCheckResult> {
    return this.libraryService.checkAccess(
      id,
      req.user.id,
      req.user.subscriptionTier,
    );
  }

  @Get(':id/my-access')
  @ApiOperation({
    summary: "Get user's access record for an item",
    description:
      "Retrieve the current user's access record for a specific content item, including progress, bookmarks, and view history.",
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Access record retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        progress: { type: 'number', example: 75.5 },
        lastPosition: { type: 'number', example: 320 },
        bookmarks: { type: 'array', items: { type: 'object' } },
        viewCount: { type: 'number', example: 12 },
        lastAccessed: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Content or access record not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  getMyAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.libraryService.getUserAccessRecord(userId, id);
  }

  @Post('access/record')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record content view and sync progress',
    description:
      'Record a view event for content and synchronize reading/watch progress. Used to track user engagement and update last position.',
  })
  @ApiBody({ type: RecordAccessDto })
  @ApiResponse({
    status: 200,
    description: 'Access recorded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or position values',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  recordAccess(@Body() dto: RecordAccessDto, @Request() req: any) {
    return this.libraryService.recordAccess(req.user.id, dto);
  }

  @Post(':id/bookmarks')
  @ApiOperation({
    summary: 'Add a bookmark',
    description:
      'Add a bookmark at a specific position in the content. Useful for saving important sections or study points.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiBody({ type: AddBookmarkDto })
  @ApiCreatedResponse({
    description: 'Bookmark added successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid position or bookmark already exists at position',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  addBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddBookmarkDto,
    @Request() req: any,
  ) {
    return this.libraryService.addBookmark(req.user.id, id, dto);
  }

  @Delete(':id/bookmarks/:position')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove a bookmark by position',
    description:
      'Remove a specific bookmark from content by its position value.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiParam({
    name: 'position',
    description: 'Bookmark position to remove',
    type: Number,
    example: 45,
  })
  @ApiResponse({
    status: 200,
    description: 'Bookmark removed successfully',
  })
  @ApiNotFoundResponse({ description: 'Content or bookmark not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  removeBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('position', ParseIntPipe) position: number,
    @UserId() userId: string,
  ) {
    return this.libraryService.removeBookmark(userId, id, position);
  }

  // ══════════════════════════════════════════════════════════
  //  ADMIN ROUTES — SUPER_ADMIN role required
  // ══════════════════════════════════════════════════════════

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Create new library content',
    description:
      'Create new library content with metadata, access settings, and file references. Only accessible by Super Admins.',
  })
  @ApiBody({ type: CreateLibraryDto })
  @ApiCreatedResponse({
    description: 'Content created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Content with same title already exists',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  create(@Body() dto: CreateLibraryDto) {
    return this.libraryService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Update content metadata',
    description:
      'Update metadata for existing library content including title, description, access settings, and file references.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiBody({ type: UpdateLibraryDto })
  @ApiResponse({
    status: 200,
    description: 'Content updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLibraryDto,
  ) {
    return this.libraryService.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Publish content',
    description:
      'Publish content making it visible in the public catalogue based on access settings.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Content published successfully',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.publish(id);
  }

  @Patch(':id/unpublish')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Unpublish content',
    description:
      'Unpublish content, hiding it from the public catalogue while maintaining existing access grants.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Content unpublished successfully',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.unpublish(id);
  }

  @Post(':id/grant-access')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Manually grant access to a user',
    description:
      'Manually grant a user access to specific content. Optionally link to a payment and set expiration date.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User UUID to grant access to',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        paymentId: {
          type: 'string',
          description: 'Optional payment reference',
          example: 'pay_abc123',
        },
        expiresAt: {
          type: 'string',
          description: 'Optional access expiration date (ISO 8601)',
          example: '2025-12-31T23:59:59Z',
        },
      },
      required: ['userId'],
    },
  })
  @ApiCreatedResponse({
    description: 'Access granted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID or content ID',
  })
  @ApiResponse({
    status: 409,
    description: 'User already has access to this content',
  })
  @ApiNotFoundResponse({ description: 'Content or user not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  grantAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { userId: string; paymentId?: string; expiresAt?: string },
  ) {
    return this.libraryService.grantAccess(
      body.userId,
      id,
      body.paymentId,
      body.expiresAt ? new Date(body.expiresAt) : undefined,
    );
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Soft-delete content',
    description:
      'Soft-delete content. Content is archived but not permanently removed. Existing access grants remain valid.',
  })
  @ApiParam({
    name: 'id',
    description: 'Content item UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Content soft-deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'User does not have required role' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.remove(id);
  }
}
