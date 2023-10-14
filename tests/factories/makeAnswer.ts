import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/Answer';

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
  const question = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}
