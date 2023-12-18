import { Module } from '@nestjs/common';
import { AuthenticateController } from './controller/authenticate.controller';
import { CreateAccountController } from './controller/createAccount.controller';
import { CreateQuestionController } from './controller/createQuestion.controller';
import { FetchRecentQuestionsController } from './controller/fetchRecentQuestions.controller';
import { DatabaseModule } from '@/database/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/useCases/createQuestionUseCase';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/useCases/fetchRecentQuestionsUseCase';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/useCases/authenticateStudentUseCase';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterStudentUseCase } from '@/domain/forum/application/useCases/registerStudentUseCase';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/useCases/getQuestionBySlugUseCase';
import { GetQuestionBySlugController } from './controller/getQuestionBySlug.controller';
import { EditQuestionController } from './controller/editQuestion.controller';
import { EditQuestionUseCase } from '@/domain/forum/application/useCases/editQuestionUseCase';
import { DeleteQuestionController } from './controller/deleteQuestion.controller';
import { DeleteQuestionUseCase } from '@/domain/forum/application/useCases/deleteQuestionUseCase';
import { AnswerQuestionController } from './controller/answerQuestion.controller';
import { AnswerQuestionUseCase } from '@/domain/forum/application/useCases/answerQuestionUseCase';
import { EditAnswerController } from './controller/editAnswer.controller';
import { EditAnswerUseCase } from '@/domain/forum/application/useCases/editAnswerUseCase';
import { DeleteAnswerController } from './controller/deleteAnswer.controller';
import { DeleteAnswerUseCase } from '@/domain/forum/application/useCases/deleteAnswerUseCase';
import { FetchQuestionAnswersController } from './controller/fetchQuestionAnswers.controller';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/useCases/fetchQuestionAnswersUseCase';
import { ChooseQuestionBestAnswerController } from './controller/chooseQuestionBestAnswer.controller';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/useCases/chooseQuestionBestAnswerUseCase';
import { CommentOnQuestionController } from './controller/commentOnQuestion.controller';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/useCases/commentOnQuestionUseCase';
import { DeleteQuestionCommentCommentController } from './controller/deleteQuestionComment.controller';
import { DeleteQuestionCommentsUseCase } from '@/domain/forum/application/useCases/deleteQuestionCommentUseCase';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/useCases/commentOnAnswerRepositoryUseCase';
import { CommentOnAnswerController } from './controller/commentOnAnswer.controller';
import { DeleteAnswerCommentCommentController } from './controller/deleteAnswerComment.controller';
import { DeleteAnswerCommentsUseCase } from '@/domain/forum/application/useCases/deleteAnswerCommentUseCase';
import { FetchQuestionCommentsController } from './controller/fetchQuestionComments.controller';
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/useCases/fetchQuestionCommentsUseCase';
import { FetchAnswerCommentsController } from './controller/fetchAnswerComments.controller';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/useCases/fetchAnswerCommentsUseCase';
import { UploadAttachmentsController } from './controller/uploadAttachments.controller';
import { StorageModule } from '../storage/storage.module';
import { UploadAndCreateAttachmentsUseCase } from '@/domain/forum/application/useCases/uploadAndCreateAttachmentsUseCase';
import { ReadNotificationController } from './controller/readNotification.controller';
import { ReadNotificationUseCase } from '@/domain/notification/application/useCases/readNotificationUseCase';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentCommentController,
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentsController,
    ReadNotificationController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteQuestionCommentsUseCase,
    CommentOnAnswerUseCase,
    DeleteAnswerCommentsUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentsUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
