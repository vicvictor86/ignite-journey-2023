import {
  Controller, Get, BadRequestException, Param,
} from '@nestjs/common';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/useCases/getQuestionBySlugUseCase';
import { QuestionDetailsPresenter } from '../presenter/questionDetailsPresenter';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(
    private getQuestionBySlug: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) };
  }
}
