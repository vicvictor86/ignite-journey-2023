import {
  BadRequestException,
  Controller, Delete, HttpCode, Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/currentUserDecorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionUseCase } from '@/domain/forum/application/useCases/deleteQuestionUseCase';

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') questionId: string, @CurrentUser() user: UserPayload) {
    const userId = user.sub;

    const result = await this.deleteQuestionUseCase.execute({
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
