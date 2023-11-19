import { Injectable } from '@nestjs/common';
import { Answer } from '../../enterprise/entities/Answer';
import { AnswersRepository } from '../repositories/answersRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { Either, left, right } from '@/core/Either';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { AnswerAttachment } from '../../enterprise/entities/AnswerAttachment';
import { AnswerAttachmentList } from '../../enterprise/entities/AnswerAttachmentList';
import { AnswerAttachmentsRepository } from '../repositories/answerAttachmentsRepository';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsId: string[];
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  answer: Answer;
}>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository
      .findManyByAnswerId(answerId);

    const answerAttachmentsList = new AnswerAttachmentList(currentAnswerAttachments);

    const answerAttachments = attachmentsId.map((attachmentId) => {
      const attachment = AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });

      return attachment;
    });

    answerAttachmentsList.update(answerAttachments);

    answer.attachments = answerAttachmentsList;
    answer.content = content;

    await this.answersRepository.save(answer);

    return right({ answer });
  }
}
