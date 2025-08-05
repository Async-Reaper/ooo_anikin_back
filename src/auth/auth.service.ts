import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { AuthDto } from "./dto/auth.dto";
import * as process from "node:process";
import { UserDto } from "./dto/user.dto";

const users = [
  {
    userName: "hui",
    userGUID: "2"
  },
  {
    userName: "pizda",
    userGUID: "1"
  },
]

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) {
  }

  async login(userDto: AuthDto) {
    const user = await this.validateUser(userDto);

    if (user) {
      return this.generateToken(user)
    } else {
      throw new HttpException({message: "Такого пользователя не найдено"}, HttpStatus.BAD_REQUEST)
    }
  }


  private async validateUser(userDto: AuthDto) {
    return users.find(user => user.userName === userDto.login && user)
  }

  private async generateToken(user: UserDto) {
    const payload = user;
    const access_token = this.jwtService.sign(
      { userGUID: payload.userGUID, userName: payload.userName },
      {
        secret: process.env.JWT_SECRET_ACCESS,
        expiresIn: '30m'
      }
    );

    const refresh_token = this.jwtService.sign(
      {
        userGUID: payload.userGUID,
      },
      {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: '7d'
      }
    );

    return {
      access_token: access_token,
      refresh_token: refresh_token
    }
  }

  async init(token: string) {
    const userInfo = this.jwtService.decode(token)
    console.log(userInfo)
    users.find(user => user.userGUID === userInfo.userId && user)
  }
}
