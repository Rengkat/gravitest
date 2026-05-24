import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { SchoolClass } from './entities/school-class.entity';
import { SchoolAdmin } from './entities/school-admin.entity';
import { School } from './entities/school.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { HashModule } from 'src/common/hash/hash.module';

@Module({
  controllers: [SchoolsController],
  providers: [SchoolsService],
  imports: [
    TypeOrmModule.forFeature([School, SchoolAdmin, SchoolClass]),
    PaginationModule,
    HashModule,
  ],
  exports: [SchoolsService],
})
export class SchoolsModule {}
