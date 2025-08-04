import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {AuthDto} from "./dto/auth.dto";
import * as process from "node:process";

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) {}

    async login(userDto: AuthDto) {
        // const user = await this.validateUser(userDto)
        return this.generateToken(userDto)
    }

    private async generateToken(user: AuthDto) {
        const payload = user;
        const access_token = this.jwtService.sign(
          { login: payload.login },
          {
              secret: process.env.JWT_SECRET_ACCESS,
              expiresIn: '30m'
          }
        );

        const refresh_token = this.jwtService.sign(
          { id: "payload.id" },
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

    // private async validateUser(userDto: AuthDto) {
    //     const user = await this.userService.getUserBylogin(userDto.login);
    //     const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    //     if (user && passwordEquals) {
    //         return user;
    //     }
    //     throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    // }
}
