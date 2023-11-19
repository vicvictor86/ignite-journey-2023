import {
  BadRequestException,
  Controller, Delete, HttpCode, Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/currentUserDecorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionCommentsUseCase } from '@/domain/forum/application/useCases/deleteQuestionCommentUseCase';

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentCommentController {
  constructor(private deleteQuestionCommentUseCase: DeleteQuestionCommentsUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') commentId: string, @CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteQuestionCommentUseCase.execute({
      commentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
