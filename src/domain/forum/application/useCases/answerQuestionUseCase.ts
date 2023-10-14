import { Either, right } from '@/core/Either';
import { UniqueEntityId } from '../../../../core/entities/UniqueEntityId';
import { Answer } from '../../enterprise/entities/Answer';
import { AnswersRepository } from '../repositories/answersRepository';
import { AnswerAttachment } from '../../enterprise/entities/AnswerAttachment';
import { AnswerAttachmentList } from '../../enterprise/entities/AnswerAttachmentList';

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsId: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer; }>;

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    questionId,
    instructorId,
    content,
    attachmentsId,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    const answerAttachments = attachmentsId.map((attachmentId) => {
      const attachment = AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });

      return attachment;
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
