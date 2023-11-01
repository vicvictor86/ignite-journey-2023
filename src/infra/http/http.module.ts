import { Module } from '@nestjs/common';
import { AuthenticateController } from './controller/authenticate.controller';
import { CreateAccountController } from './controller/createAccount.controller';
import { CreateQuestionController } from './controller/createQuestion.controller';
import { FetchRecentQuestionsController } from './controller/fetchRecentQuestions.controller';
import { DatabaseModule } from '@/database/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/useCases/createQuestionUseCase';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/useCases/fetchRecentQuestionsUseCase';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/useCases/authenticateStudent';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterStudentUseCase } from '@/domain/forum/application/useCases/registerStudentUseCase';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
