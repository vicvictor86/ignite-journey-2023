import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { OnAnswerCreated } from '@/domain/forum/application/subscribers/onAnswerCreated';
import { OnQuestionBestAnswerChosen } from '@/domain/forum/application/subscribers/onQuestionBestAnswerChosen';
import { SendNotificationUseCase } from '@/domain/notification/application/useCases/sendNotificationUseCase';

@Module({
  imports: [DatabaseModule],
  providers: [
    OnQuestionBestAnswerChosen,
    OnAnswerCreated,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
