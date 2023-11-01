import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { AnswerAttachment, AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/AnswerAttachment';

export function makeAnswerAttachments(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const answerAttachments = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return answerAttachments;
}
