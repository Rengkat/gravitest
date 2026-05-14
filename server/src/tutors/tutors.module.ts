import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorAvailability } from './entities/tutor-availability.entity';
import { TutorPayout } from './entities/tutor-payout.entity';
import { TutorProfile } from './entities/tutor-profile.entity';
import { TutorReview } from './entities/tutor-review.entity';
import { TutorSession } from './entities/tutor-session.entity';

@Module({
  controllers: [TutorsController],
  providers: [TutorsService],
  imports: [
    TypeOrmModule.forFeature([
      TutorPayout,
      TutorAvailability,
      TutorProfile,
      TutorReview,
      TutorSession,
    ]),
  ],
})
export class TutorsModule {}
