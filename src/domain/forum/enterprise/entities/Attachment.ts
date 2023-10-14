import { Entity } from '@/core/entities/Entity';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

interface AttachmentProps {
  title: string;
  link: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string { return this.title; }

  get link(): string { return this.link; }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
