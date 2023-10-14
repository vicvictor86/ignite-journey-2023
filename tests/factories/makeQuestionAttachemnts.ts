import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/QuestionAttachment';

export function makeQuestionAttachments(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const questionAttachments = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return questionAttachments;
}
