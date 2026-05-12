import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StudentProfile } from './entities/student-profile.entity';
import { SchoolAdmin } from './entities/school-admin.entity';
import { TutorProfile } from './entities/tutor-profile.entity';
import { StudyActivity } from './entities/study-activity.entity';
import { StudyStreak } from './entities/study-streak.entity';
import { TopicMasteryHistory } from './entities/topic-mastery-history.entity';
import { WeakTopic } from './entities/weak-topic.entity';
import { BulkCreateUsersProvider } from './providers/create-bulk-users.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { HashModule } from 'src/common/hash/hash.module';
import { CreateUserProvider } from './providers/create-user.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, BulkCreateUsersProvider, CreateUserProvider],
  exports: [UserService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([
      User,
      StudentProfile,
      SchoolAdmin,
      TutorProfile,
      StudyActivity,
      StudyStreak,
      TopicMasteryHistory,
      WeakTopic,
    ]),
    PaginationModule,
    HashModule,
  ],
})
export class UserModule {}
