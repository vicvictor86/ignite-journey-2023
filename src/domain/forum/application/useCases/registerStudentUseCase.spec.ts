import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { FakeHasher } from 'test/cryptography/fakeHasher';
import { RegisterStudentUseCase } from './registerStudentUseCase';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Create Student Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it('should be able to create a student', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should be able to hash a password upon registration', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
  });
});
