import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Optional } from '@/core/types/optional';
import { Slug } from './valueObjects/Slug';
import { AggregateRoot } from '@/core/entities/aggregateRoot';
import { QuestionAttachmentList } from './QuestionAttachmentList';

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId ?: UniqueEntityId;
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId) {
    const question = new Question({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.title),
      attachments: props.attachments ?? new QuestionAttachmentList(),
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return question;
  }

  get authorId() { return this.props.authorId; }

  get bestAnswer() { return this.props.bestAnswerId; }

  set bestAnswerId(bestAnswerId: UniqueEntityId) {
    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  get slug() { return this.props.slug; }

  get attachments() { return this.props.attachments; }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get title() { return this.props.title; }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  get content() { return this.props.content; }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  get excerpt() {
    return this.content
      .substring(0, 120)
      .trimEnd()
      .concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
