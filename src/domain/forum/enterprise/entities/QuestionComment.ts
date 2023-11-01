import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Optional } from '@/core/types/optional';
import { Comment, CommentProps } from './Comment';

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() { return this.props.questionId; }

  static create(props: Optional<QuestionCommentProps, 'createdAt'>, id?: UniqueEntityId) {
    const questionComment = new QuestionComment({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return questionComment;
  }
}
