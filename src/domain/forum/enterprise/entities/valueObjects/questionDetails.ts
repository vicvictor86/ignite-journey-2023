import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { ValueObject } from '@/core/entities/ValueObjects';
import { Attachment } from '../Attachment';
import { Slug } from './Slug';

export interface QuestionDetailsProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  author: string;
  title: string;
  content: string;
  slug: Slug;
  attachments: Attachment[];
  bestAnswerId?: UniqueEntityId | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get authorId() { return this.props.authorId; }

  get questionId() { return this.props.questionId; }

  get author() { return this.props.author; }

  get title() { return this.props.title; }

  get content() { return this.props.content; }

  get slug() { return this.props.slug; }

  get attachments() { return this.props.attachments; }

  get bestAnswer() { return this.props.bestAnswerId; }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }
}
