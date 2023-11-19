import { InMemoryAttachmentsRepository } from 'test/repositories/InMemoryAttachmentsRepository';
import { FakeUploader } from 'test/storage/fakeUploader';
import { UploadAndCreateAttachmentsUseCase } from './uploadAndCreateAttachmentsUseCase';
import { InvalidAttachmentTypeError } from './errors/InvalidAttachmentType';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentsUseCase;

describe('Upload and Create Attachment Use Case', () => {
  beforeEach(() => {
    fakeUploader = new FakeUploader();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    sut = new UploadAndCreateAttachmentsUseCase(inMemoryAttachmentsRepository, fakeUploader);
  });

  it('should be able to create and upload a attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to create an attachment with invalid type', async () => {
    const result = await sut.execute({
      fileName: 'music.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceof(InvalidAttachmentTypeError);
  });
});
