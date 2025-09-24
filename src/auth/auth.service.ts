import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import * as process from "node:process";
import { UserDto } from "./dto/user.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService) {
  }

  async login(userDto: AuthDto) {
    const user = await this.validateUser(userDto);

    if (user) {
      return this.generateToken(user)
    } else {
      throw new HttpException({ message: "Такого пользователя не найдено" }, HttpStatus.BAD_REQUEST)
    }
  }

  private async validateUser(userDto: AuthDto) {
    const urlMainBase = `${this.configService.get('URL_1C_MAIN')}/authorization`;
    const urlAdditionalBase = `${this.configService.get('URL_1C_ADDITIONAL')}/authorization`;

    try {
      const response = await axios.post(urlMainBase,
        { login: userDto.login, password: userDto.password },
        {
          headers: {
            Authorization: process.env.TOKEN_1C
          }
        }
      );

      return { ...response.data, typeOfBase: 'main' };
    } catch (e) {
      console.log("error", e)
      // if (e.message.includes('ETIMEDOUT')) {
      //   throw new HttpException({ message: "Нет соединения с сервером 1С" }, HttpStatus.BAD_GATEWAY)
      // }

      // if (e.response.status === 400) {
      const responseSecond = await axios.post(urlAdditionalBase,
        { login: userDto.login, password: userDto.password },
        {
          headers: {
            Authorization: process.env.TOKEN_1C
          }
        }
      );

      return { ...responseSecond.data, typeOfBase: 'additiona' };
      // }
      // throw new HttpException({ message: "Произошла ошибка" }, HttpStatus.BAD_REQUEST)
    }
  }

  private async generateToken(user: UserDto) {
    const payload = user;
    const access_token = this.jwtService.sign(
      {
        userGUID: payload.userGUID,
        userName: payload.userName,
        role: payload.role,
        typeOfBase: payload.typeOfBase,
        country: payload.country,
        isNotControlRemains: payload.isNotControlRemains
      },
      {
        secret: process.env.JWT_SECRET_ACCESS,
        expiresIn: '30m'
      }
    );

    const refresh_token = this.jwtService.sign(
      {
        userGUID: payload.userGUID,
        userName: payload.userName,
        role: payload.role,
        typeOfBase: payload.typeOfBase,
        country: payload.country,
        isNotControlRemains: payload.isNotControlRemains
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

  async getAll(request: Request) {
    const token = request.headers['authorization'];

    if (!token) {
      return new HttpException({ message: "Пользователь не авторизован" }, HttpStatus.UNAUTHORIZED)
    }

    try {
      const response = await axios.get(`${this.configService.get('URL_1C_MAIN')}/users`, {
        headers: {
          Authorization: process.env.TOKEN_1C
        }
      })
      return response.data;
    } catch (e) {
      console.log('[error get all users]', e.message)
    }
  }
}
