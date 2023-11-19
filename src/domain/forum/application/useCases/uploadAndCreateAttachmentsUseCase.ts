import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { Attachment } from '../../enterprise/entities/Attachment';
import { InvalidAttachmentTypeError } from './errors/InvalidAttachmentType';
import { AttachmentsRepository } from '../repositories/attachmentsRepository';
import { Uploader } from '../storage/uploader';

interface UploadAndCreateAttachmentsUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentsUseCaseResponse = Either<InvalidAttachmentTypeError, {
  attachment: Attachment,
}>;

@Injectable()
export class UploadAndCreateAttachmentsUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentsUseCaseRequest): Promise<UploadAndCreateAttachmentsUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
