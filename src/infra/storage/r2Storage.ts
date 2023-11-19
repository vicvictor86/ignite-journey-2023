import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { UploadParams, Uploader } from '@/domain/forum/application/storage/uploader';
import { EnvService } from '../env/env.service';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(
    private envService: EnvService,
  ) {
    this.client = new S3Client({
      endpoint: 'https://s3.tebi.io',
      region: 'global',
      credentials: {
        accessKeyId: this.envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload({
    body,
    fileName,
    fileType,
  }: UploadParams) {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}
