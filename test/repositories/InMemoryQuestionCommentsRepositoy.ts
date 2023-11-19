import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/questionCommentsRepository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/QuestionComment';
import { InMemoryStudentsRepository } from './InMemoryStudentsRepository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/CommentWithAuthor';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  public items: QuestionComment[] = [];

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id);

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items
          .find((student) => student.id.equals(comment.authorId));

        if (!author) {
          throw new Error(`Author with id ${comment.authorId} not found`);
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name,
        });
      });

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === questionComment.id);

    this.items.splice(index, 1);
  }
}
