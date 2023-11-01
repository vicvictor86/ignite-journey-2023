import { HashComparer } from '@/domain/forum/application/cryptography/hashComparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenerator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
