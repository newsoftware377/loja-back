import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto'

@Injectable()
export class HashService {
  public createId = (name: string) => {
    const hash = crypto.randomBytes(20).toString('hex')
    const standardName = name.toLowerCase().replace(' ', '-')

    return `${standardName}-${hash}`;
  }

  public createHashWithSalt(value: string) {
    const salt = crypto.randomBytes(32).toString('hex')
    const hash = crypto.pbkdf2Sync(value, salt, 10000, 50, 'sha512').toString('hex')

    return `${hash}.${salt}`
  }

  public compareWithSalt(value: string, hashWithSalt: string) {
    const [hash, salt] = hashWithSalt.split('.')
    const hashedPassword = crypto.pbkdf2Sync(value, salt, 10000, 50, 'sha512').toString('hex')
    
    return hash === hashedPassword
  }
}
