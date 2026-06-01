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
  ApiBody,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { QueryLibraryDto } from './dto/query-library.dto';
import { RecordAccessDto } from './dto/record-access.dto';
import { AddBookmarkDto } from './dto/add-bookmark.dto';
import { AccessCheckResult } from './types/library.interfaces';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserId } from 'src/auth/decorators/current-user.decorator';
import { UserRole } from 'src/common/enums/enums';

@ApiTags('Library')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // ════════════════════════════════════════════════════════════
  //  BLOCK 1 — STATIC ADMIN ROUTES  (admin/*)
  // ════════════════════════════════════════════════════════════

  @Get('admin/all')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] List all content including drafts',
    description:
      'Returns every content record regardless of isPublished or isActive status. ' +
      'Supports all the same filters as the user-facing browse endpoint plus isPublished and isActive.',
  })
  @ApiQuery({ name: 'contentType', required: false, example: 'ebook' })
  @ApiQuery({ name: 'subject', required: false, example: 'physics' })
  @ApiQuery({ name: 'examType', required: false, example: 'waec' })
  @ApiQuery({ name: 'isFree', required: false, example: false })
  @ApiQuery({ name: 'isPublished', required: false, example: false })
  @ApiQuery({ name: 'isActive', required: false, example: true })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'DESC' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ description: 'Paginated admin content list' })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
  findAllAdmin(@Query() query: QueryLibraryDto) {
    return this.libraryService.findAllAdmin(query);
  }

  @Get('admin/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Platform-wide library statistics',
    description:
      'Returns total counts, free vs paid split, top viewed and top downloaded items.',
  })
  @ApiOkResponse({
    description: 'Library statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 250 },
        published: { type: 'number', example: 200 },
        free: { type: 'number', example: 120 },
        paid: { type: 'number', example: 130 },
        topViewed: { type: 'array', items: { type: 'object' } },
        topDownloaded: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
  getStats() {
    return this.libraryService.getStats();
  }

  // ════════════════════════════════════════════════════════════
  //  BLOCK 2 — STATIC USER ROUTES  (me/*, access/*)
  // ════════════════════════════════════════════════════════════

  @Get('me/library')
  @ApiOperation({
    summary: "Get current user's library",
    description:
      'Returns all content the authenticated user has purchased or has subscription access to. ' +
      'Includes reading progress and bookmarks. Ordered by last accessed.',
  })
  @ApiOkResponse({ description: "User's accessible content with progress" })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getUserLibrary(@UserId() userId: string) {
    return this.libraryService.getUserLibrary(userId);
  }

  @Post('access/record')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Record a content view and sync progress',
    description:
      'Increments the global view counter and updates personal progress. ' +
      'Call whenever a user opens, resumes, or completes content.',
  })
  @ApiBody({ type: RecordAccessDto })
  @ApiOkResponse({ description: 'Access recorded and progress updated' })
  @ApiBadRequestResponse({
    description: 'Invalid progress value (must be 0–100)',
  })
  @ApiForbiddenResponse({
    description: 'User does not have access to this content',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  recordAccess(@Body() dto: RecordAccessDto, @Request() req: any) {
    return this.libraryService.recordAccess(req.user.id, dto);
  }

  // ════════════════════════════════════════════════════════════
  //  BLOCK 3 — COLLECTION ROUTES  (GET / and POST /)
  // ════════════════════════════════════════════════════════════

  @Get()
  @ApiOperation({
    summary: 'Browse content catalogue',
    description:
      'Returns published content the authenticated user can see. ' +
      "Results are enriched based on the user's subscription tier.",
  })
  @ApiQuery({ name: 'contentType', required: false, example: 'ebook' })
  @ApiQuery({ name: 'subject', required: false, example: 'mathematics' })
  @ApiQuery({ name: 'examType', required: false, example: 'waec' })
  @ApiQuery({ name: 'classLevel', required: false, example: 'ss3' })
  @ApiQuery({ name: 'isFree', required: false, example: true })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false, example: 'totalViews' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'DESC' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ description: 'Paginated content catalogue' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  findAll(@Query() query: QueryLibraryDto, @Request() req: any) {
    return this.libraryService.findAll(query, req.user?.subscriptionTier);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Create new library content',
    description:
      'Creates content as an unpublished draft. ' +
      'Exactly one of isFree, requiredTier, or priceKobo must be set.',
  })
  @ApiBody({ type: CreateLibraryDto })
  @ApiCreatedResponse({ description: 'Content created as draft' })
  @ApiBadRequestResponse({
    description: 'Invalid input or conflicting access model fields',
  })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
  create(@Body() dto: CreateLibraryDto) {
    return this.libraryService.create(dto);
  }

  // ════════════════════════════════════════════════════════════
  //  BLOCK 4 — PARAMETERISED GET ROUTES  (:id, :id/*)
  //  All read-only. Any authenticated user can call these.
  // ════════════════════════════════════════════════════════════

  @Get(':id')
  @ApiOperation({
    summary: 'Get single content item metadata',
    description:
      'Returns metadata for a content item. fileUrl is withheld for paid content ' +
      'until the client confirms access via GET :id/access.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiOkResponse({ description: 'Content metadata' })
  @ApiNotFoundResponse({ description: 'Content not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.findOne(id);
  }

  @Get(':id/access')
  @ApiOperation({
    summary: 'Check if current user has access to content',
    description:
      'Returns { hasAccess, reason }. The frontend uses this to decide what to render: ' +
      'open the reader, show a purchase prompt, or show a subscription upgrade prompt. ' +
      'This is a service call — it informs the client, it does not gate the request itself.\n\n' +
      'reason values:\n' +
      '  free         → content is free, always allowed\n' +
      '  owned        → user has a purchased or manually granted access record\n' +
      "  subscription → user's subscription tier meets the requiredTier\n" +
      '  no_access    → must purchase or upgrade subscription\n' +
      '  expired      → had access but it has expired',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiOkResponse({
    description: 'Access check result',
    schema: {
      type: 'object',
      properties: {
        hasAccess: { type: 'boolean', example: true },
        reason: {
          type: 'string',
          enum: ['free', 'owned', 'subscription', 'no_access', 'expired'],
          example: 'owned',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
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
    summary: "Get user's access record for a content item",
    description:
      'Returns personal engagement data: progress %, bookmarks, view count, last accessed. ' +
      'Returns null if the user has never accessed this item.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiOkResponse({
    description: 'Access record',
    schema: {
      type: 'object',
      nullable: true,
      properties: {
        progressPercent: { type: 'number', example: 75 },
        bookmarks: { type: 'array', items: { type: 'object' } },
        viewCount: { type: 'number', example: 12 },
        lastAccessedAt: { type: 'string', format: 'date-time' },
        isCompleted: { type: 'boolean', example: false },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  getMyAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.libraryService.getUserAccessRecord(userId, id);
  }

  // ════════════════════════════════════════════════════════════
  //  BLOCK 5 — PARAMETERISED MUTATIONS  (POST, PATCH, DELETE on :id)
  // ════════════════════════════════════════════════════════════

  @Post(':id/bookmarks')
  @ApiOperation({
    summary: 'Add a bookmark',
    description:
      'Saves a bookmark at a given position. ' +
      'position = page number for ebook/document/past_question. ' +
      'position = seconds for video/audio.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiBody({ type: AddBookmarkDto })
  @ApiCreatedResponse({ description: 'Bookmark added' })
  @ApiForbiddenResponse({
    description: 'User does not have access to this content',
  })
  @ApiNotFoundResponse({ description: 'Content not found' })
  addBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddBookmarkDto,
    @Request() req: any,
  ) {
    return this.libraryService.addBookmark(req.user.id, id, dto);
  }

  @Post(':id/grant-access')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Manually grant access to a user',
    description:
      'Creates a LibraryAccess record for any user. ' +
      'Re-granting the same user + content pair refreshes expiresAt instead of creating a duplicate row.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        paymentId: { type: 'string', example: 'MANUAL-PAY-2024-001' },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-12-31T23:59:59.000Z',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Access granted' })
  @ApiNotFoundResponse({ description: 'Content or user not found' })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
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

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Update content metadata',
    description:
      'Partial update of any metadata field. ' +
      'When changing the access model, set the new field only — server validates mutual exclusivity.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiBody({ type: UpdateLibraryDto })
  @ApiOkResponse({ description: 'Content updated' })
  @ApiBadRequestResponse({ description: 'Conflicting access model fields' })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
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
      'Sets isPublished = true. Content becomes visible in the authenticated catalogue.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiOkResponse({ description: 'Content published' })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.publish(id);
  }

  @Patch(':id/unpublish')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Unpublish content',
    description:
      'Sets isPublished = false. Item disappears from user browse. ' +
      'Existing access grants and progress records are preserved.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiOkResponse({ description: 'Content unpublished' })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.unpublish(id);
  }

  @Delete(':id/bookmarks/:position')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove a bookmark by position',
    description:
      'Removes the bookmark at the given position. Silent no-op if position does not exist.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiParam({
    name: 'position',
    type: Number,
    description: 'Bookmark position',
    example: 47,
  })
  @ApiOkResponse({ description: 'Bookmark removed' })
  @ApiForbiddenResponse({
    description: 'User does not have access to this content',
  })
  removeBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('position', ParseIntPipe) position: number,
    @UserId() userId: string,
  ) {
    return this.libraryService.removeBookmark(userId, id, position);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: '[Admin] Soft-delete content',
    description:
      'Sets isActive = false. Data is preserved, access grants remain valid. ' +
      'Item disappears from all user-facing endpoints.',
  })
  @ApiParam({ name: 'id', type: String, description: 'Content UUID' })
  @ApiOkResponse({ description: 'Content deactivated' })
  @ApiNotFoundResponse({ description: 'Content not found' })
  @ApiForbiddenResponse({ description: 'Requires SUPER_ADMIN role' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.remove(id);
  }
}
