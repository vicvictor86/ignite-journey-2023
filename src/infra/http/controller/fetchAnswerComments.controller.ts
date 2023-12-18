import {
  Controller, Query, Get, BadRequestException, Param,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zodValidationPipe';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/useCases/fetchAnswerCommentsUseCase';
import { CommentWithAuthorPresenter } from '../presenter/commentWithAuthorPresenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase,
  ) {}

  @Get()
  async handle(
  @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { comments } = result.value;

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
