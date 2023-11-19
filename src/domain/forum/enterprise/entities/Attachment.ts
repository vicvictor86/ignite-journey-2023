import { Entity } from '@/core/entities/Entity';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string { return this.props.title; }

  get url(): string { return this.props.url; }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
