import { Question } from '../../enterprise/entities/Question';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { Either, left, right } from '@/core/Either';
import { QuestionAttachmentsRepository } from '../repositories/questionAttachmentsRepository';
import { QuestionAttachmentList } from '../../enterprise/entities/QuestionAttachmentList';
import { QuestionAttachment } from '../../enterprise/entities/QuestionAttachment';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  question: Question;
}>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionsAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
    title,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments = await this.questionsAttachmentsRepository
      .findManyByQuestionId(questionId);

    const questionAttachmentsList = new QuestionAttachmentList(currentQuestionAttachments);

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      const attachment = QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });

      return attachment;
    });

    questionAttachmentsList.update(questionAttachments);

    question.attachments = questionAttachmentsList;
    question.content = content;
    question.title = title;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
