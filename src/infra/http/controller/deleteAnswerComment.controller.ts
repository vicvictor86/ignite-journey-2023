import {
  BadRequestException,
  Controller, Delete, HttpCode, Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/currentUserDecorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerCommentsUseCase } from '@/domain/forum/application/useCases/deleteAnswerCommentUseCase';

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentsUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') commentId: string, @CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteAnswerCommentUseCase.execute({
      commentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
