import {
  Controller, Get, BadRequestException, Param,
} from '@nestjs/common';
import { QuestionPresenter } from '../presenter/questionPresenter';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/useCases/getQuestionBySlugUseCase';

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

    return { question: QuestionPresenter.toHTTP(result.value.question) };
  }
}
