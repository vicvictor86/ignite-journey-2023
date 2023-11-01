import { Entity } from '@/core/entities/Entity';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId;
  attachmentId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() { return this.props.answerId; }

  get attachmentId() { return this.props.attachmentId; }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
    const answerAttachment = new AnswerAttachment(props, id);

    return answerAttachment;
  }
}
