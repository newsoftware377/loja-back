import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto'

@Injectable()
export class HashService {
  public createIdToShop = (count: number) => {
    const hash = crypto.randomBytes(20).toString('hex')
    const standardName = `loja-${count+1}`

    return `${standardName}-${hash}`;
  }

  public createIdToWarehouse = (count: number) => {
    const hash = crypto.randomBytes(20).toString('hex')
    const standardName = `deposito-${count+1}`

    return `${standardName}-${hash}`;
  }

  public createIdToUser = (name: string) => {
    const hash = crypto.randomBytes(20).toString('hex')
    const standardName = decodeURI(name.replaceAll(' ', '-').toLowerCase())

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
