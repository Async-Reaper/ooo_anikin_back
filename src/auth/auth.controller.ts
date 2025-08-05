import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "./dto/user.dto";

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
  @ApiOperation({ summary: 'Обновление токена' })
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

  @Get('init')
  @ApiOperation({ summary: 'Получение инфы о пользователе' })
  @ApiResponse({ status: 200, type: UserDto })
  init(@Headers('Authorization') cookie: string) {
    const accessToken = cookie
      ?.split('; ')
      .find((row) => row.startsWith('refresh_token='))
      ?.split('=')[1];

    this.authService.init(accessToken);
  }
}
