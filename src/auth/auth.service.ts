import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import * as process from "node:process";
import { UserDto } from "./dto/user.dto";

const users = [
  {
    userName: "user1",
    userGUID: "2",
    debts: 2341
  },
  {
    userName: "user2",
    userGUID: "1",
    debts: 2341
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

  async searchUser(userGUID: string) {
    return users.find(user => user.userGUID === userGUID && user)
  }

  private async generateToken(user: UserDto) {
    const payload = user;
    const access_token = this.jwtService.sign(
      { userGUID: payload.userGUID, userName: payload.userName, debts: payload.debts },
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

  async init(request: Request) {
    const token = request.headers['authorization'];

    if (!token) {
      return new HttpException({ message: "Пользователь не авторизован" }, HttpStatus.UNAUTHORIZED)
    }
    const userInfo = this.jwtService.decode(token)
    return userInfo;
  }
}
