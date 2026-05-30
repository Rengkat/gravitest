import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryAccess } from './entities/library-content-access.entity';
import { LibraryContent } from './entities/library-contnent.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService],
  imports: [
    TypeOrmModule.forFeature([LibraryAccess, LibraryContent]),
    PaginationModule,
  ],
  exports: [LibraryService, TypeOrmModule],
})
export class LibraryModule {}
