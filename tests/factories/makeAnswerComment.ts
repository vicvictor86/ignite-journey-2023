import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { AnswerComment, AnswerCommentProps } from '@/domain/forum/enterprise/entities/AnswerComment';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answerComment;
}
