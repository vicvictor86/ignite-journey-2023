import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/Either';
import { UniqueEntityId } from '../../../../core/entities/UniqueEntityId';
import { Question } from '../../enterprise/entities/Question';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { QuestionAttachment } from '../../enterprise/entities/QuestionAttachment';
import { QuestionAttachmentList } from '../../enterprise/entities/QuestionAttachmentList';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsId: string[];
}

type CreateQuestionUseCaseResponse = Either<null, {
  question: Question;
}>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId, title, content, attachmentsId,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsId.map((attachmentId) => {
      const attachment = QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });

      return attachment;
    });

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionsRepository.create(question);

    return right({ question });
  }
}
