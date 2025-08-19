import { Body, Controller, Get, Headers, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "./dto/user.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

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
  async refreshTokens(@Headers('cookie') cookie: any) {
    const refreshCookie = cookie
      ?.split('; ')
      .find((row) => row.startsWith('refresh_token='))
      ?.split('=')[1];


    const refreshData = this.jwtService.decode(refreshCookie) as UserDto;
    const userData = await this.authService.searchUser(refreshData.userGUID) as UserDto


    const newAccessToken = this.jwtService.sign({ userGUID: userData.userGUID, userName: userData.userName }, {
      secret: process.env.JWT_SECRET_ACCESS,
      expiresIn: '30m',
    });

    return {
      access_token: newAccessToken
    }
  }

  @Get('init')
  @ApiOperation({ summary: 'Получение инфы о пользователе' })
  @ApiResponse({ status: 200, type: UserDto })
  @UseGuards(JwtAuthGuard)
  init(@Req() request: Request) {
    return this.authService.init(request);
  }
}
