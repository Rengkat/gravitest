import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionExplanation } from './entities/question-explanation.entity';
import { QuestionAnswer } from './entities/question-answer.entity';
import { QuestionOption } from './entities/question-option.entity';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [
    TypeOrmModule.forFeature([
      Question,
      QuestionOption,
      QuestionAnswer,
      QuestionExplanation,
    ]),
  ],
})
export class QuestionsModule {}
