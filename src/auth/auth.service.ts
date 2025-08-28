import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import * as process from "node:process";
import { UserDto } from "./dto/user.dto";
import axios from "axios";

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
    console.log(user)
    if (user) {
      return this.generateToken(user)
    } else {
      throw new HttpException({ message: "Такого пользователя не найдено" }, HttpStatus.BAD_REQUEST)
    }
  }


  private async validateUser(userDto: AuthDto) {
    const url = "http://192.168.1.95/ut_test_copy/hs/api_v2/authorization";

    try {
      const response = await axios.post(url,
        { login: userDto.login, password: userDto.password }
      );

      return response.data;
    } catch (e) {
      console.log("error", e)
      if (e.message.includes('ETIMEDOUT')) {
        throw new HttpException({ message: "Нет соединения с сервером 1С" }, HttpStatus.BAD_GATEWAY)
      }
      throw new HttpException({ message: "Произошла ошибка" }, HttpStatus.BAD_REQUEST)
    }
  }

  private async generateToken(user: UserDto) {
    const payload = user;
    const access_token = this.jwtService.sign(
      { userGUID: payload.userGUID, userName: payload.userName, role: payload.role },
      {
        secret: process.env.JWT_SECRET_ACCESS,
        expiresIn: '30m'
      }
    );

    const refresh_token = this.jwtService.sign(
      {
        userGUID: payload.userGUID,
        userName: payload.userName
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
