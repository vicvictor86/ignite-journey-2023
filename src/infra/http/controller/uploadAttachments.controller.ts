import {
  UploadedFile,
  Controller,
  Post,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAndCreateAttachmentsUseCase } from '@/domain/forum/application/useCases/uploadAndCreateAttachmentsUseCase';
import { InvalidAttachmentTypeError } from '@/domain/forum/application/useCases/errors/InvalidAttachmentType';

@Controller('/attachments')
export class UploadAttachmentsController {
  constructor(
    private uploadAndCreateAttachments: UploadAndCreateAttachmentsUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 2, // 2MB
        }),
        new FileTypeValidator({
          fileType: '.(png|jpg|jpeg|pdf)',
        }),
      ],
    }),
  ) file: Express.Multer.File) {
    const result = await this.uploadAndCreateAttachments.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.value;

    return {
      attachmentId: attachment.id.toString(),
    };
  }
}
