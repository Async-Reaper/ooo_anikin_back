import { Body, Controller, Headers, Post, Req, Request, Res, Response, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService,
              private jwtService: JwtService) {
  }

  @Post('login')
  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({ status: 200, type: AuthDto })
  login(@Body() userDto: AuthDto) {
    return this.authService.login(userDto)
  }

  @Post('refresh')
  async refreshTokens(@Headers('cookie') cookie: string) {
    const refreshCookie = cookie
      ?.split('; ')
      .find((row) => row.startsWith('refresh_token='))
      ?.split('=')[1];


    const loginData = this.jwtService.decode(refreshCookie) as AuthDto

    const newAccessToken = this.jwtService.sign({ login: loginData.login }, {
      secret: process.env.JWT_SECRET_ACCESS,
      expiresIn: '30m',
    });

    return {
      access_tokens: newAccessToken
    }
  }
}
