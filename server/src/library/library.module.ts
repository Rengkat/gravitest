import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryAccess } from './entities/library-content-access.entity';
import { LibraryContent } from './entities/library-contnent.entity';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService],
  imports: [TypeOrmModule.forFeature([LibraryAccess, LibraryContent])],
})
export class LibraryModule {}
