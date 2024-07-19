import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JWTService {
  private readonly expiresIn = '45d'
  private readonly secretOrPrivateKey = process.env.SECRET_OR_PRIVATE_KEY
  
  async generateToken(data: any) {
    const token = jwt.sign(data, this.secretOrPrivateKey, { expiresIn: this.expiresIn } )

    return token
  }

  async decodeToken(token: string) {
    return jwt.verify(token, this.secretOrPrivateKey)
  }
}
