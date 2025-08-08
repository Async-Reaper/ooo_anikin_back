import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import * as process from "node:process";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(authHeader, { secret: process.env.JWT_SECRET_ACCESS });
            req.user = user;
            return user;
        } catch (e) {
            throw new UnauthorizedException({message: 'Произошла ошибка дешифрования токена', detail: e})
        }
    }

}
