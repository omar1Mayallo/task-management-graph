import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IBcryptService } from './bcrypt.type';

@Injectable()
export class BcryptService implements IBcryptService {
  saltRounds = 12;

  async hash(plainTextPassword: string): Promise<string> {
    return await bcrypt.hash(plainTextPassword, this.saltRounds);
  }

  async compare(myPlaintextPassword: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(myPlaintextPassword, hashPassword);
  }
}
