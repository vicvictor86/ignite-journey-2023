import {
  BadRequestException,
  Controller, Delete, HttpCode, Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/currentUserDecorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerUseCase } from '@/domain/forum/application/useCases/deleteAnswerUseCase';

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswerUseCase: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') answerId: string, @CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteAnswerUseCase.execute({
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
