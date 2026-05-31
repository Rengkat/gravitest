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

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  @ApiOperation({ summary: 'Browse content catalogue (paginated, filterable)' })
  findAll(@Query() query: QueryLibraryDto, @Request() req: any) {
    return this.libraryService.findAll(query, req.user?.subscriptionTier);
  }

  /** Single item metadata — public, file URL withheld if access denied */
  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'Get single content item metadata' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.findOne(id);
  }

  /** Current user's full purchased/subscribed library */
  @Get('me/library')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's library" })
  getUserLibrary(@UserId() userId: string) {
    return this.libraryService.getUserLibrary(userId);
  }

  @Get(':id/access')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current user can access this content' })
  @ApiResponse({
    status: 200,
    description: '{ hasAccess: boolean, reason: string }',
  })
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

  /** Access record for a specific item (progress, bookmarks, etc.) */
  @Get(':id/my-access')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's access record for a specific item" })
  getMyAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.libraryService.getUserAccessRecord(userId, id);
  }

  /** Record a view event and sync reading/watch progress */
  @Post('access/record')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a content view and sync progress' })
  recordAccess(@Body() dto: RecordAccessDto, @Request() req: any) {
    return this.libraryService.recordAccess(req.user.id, dto);
  }

  @Post(':id/bookmarks')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a bookmark' })
  addBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddBookmarkDto,
    @Request() req: any,
  ) {
    return this.libraryService.addBookmark(req.user.id, id, dto);
  }

  @Delete(':id/bookmarks/:position')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a bookmark by position' })
  removeBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('position', ParseIntPipe) position: number,
    @UserId() userId: string,
  ) {
    return this.libraryService.removeBookmark(userId, id, position);
  }

  // ══════════════════════════════════════════════════════════
  //  ADMIN ROUTES — SUPER_ADMIN role required
  // ════════════════════════════════════

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create new library content' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateLibraryDto) {
    return this.libraryService.create(dto);
  }

  /** Must be declared before @Get(':id') — handled above by route order */
  @Get('admin/all')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] List all content including drafts' })
  findAllAdmin(@Query() query: QueryLibraryDto) {
    return this.libraryService.findAllAdmin(query);
  }

  @Get('admin/stats')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Platform-wide library statistics' })
  getStats() {
    return this.libraryService.getStats();
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update content metadata' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLibraryDto,
  ) {
    return this.libraryService.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Publish content' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.publish(id);
  }

  @Patch(':id/unpublish')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Unpublish content' })
  unpublish(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.unpublish(id);
  }

  @Post(':id/grant-access')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Manually grant access to a user' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Soft-delete content' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.libraryService.remove(id);
  }
}
