import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answerCommentsRepository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/AnswerComment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/CommentWithAuthor';
import { InMemoryStudentsRepository } from './InMemoryStudentsRepository';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
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

    return answerComments;
  }

  async create(answer: AnswerComment) {
    this.items.push(answer);
  }

  async delete(answer: AnswerComment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(index, 1);
  }
}
