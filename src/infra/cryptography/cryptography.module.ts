import { Module } from '@nestjs/common';
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { JwtEncrypter } from './jwtEncrypter';
import { HashComparer } from '@/domain/forum/application/cryptography/hashComparer';
import { BcryptHasher } from './bcryptHasher';
import { HashGenerator } from '@/domain/forum/application/cryptography/hashGenerator';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator,
  ],
})
export class CryptographyModule {}
