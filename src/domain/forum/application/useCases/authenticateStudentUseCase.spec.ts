import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { FakeHasher } from 'test/cryptography/fakeHasher';
import { FakeEncrypter } from 'test/cryptography/fakeEncrypter';
import { makeStudent } from 'test/factories/makeStudent';
import { AuthenticateStudentUseCase } from './authenticateStudentUseCase';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Create Student Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter);
  });

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
