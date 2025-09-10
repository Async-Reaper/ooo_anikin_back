import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import axios from "axios";

@ApiTags('Проверка соединения')
@Controller('connection')
export class CheckController {
  constructor() {}

  @ApiOperation({ summary: 'Проверка соединения' })
  @ApiResponse({ status: 200 })
  @Get()
  check() {
    return {
      status: 200,
      message: 'Соединение установлено'
    }
  }

  @ApiOperation({ summary: 'Проверка соединения c 1C' })
  @ApiResponse({ status: 200 })
  @Get('1c')
  async check1C() {
    try {
      const response = await axios.get('http://192.168.1.95/ut_test_copy/');
      setTimeout(() => {
        if (!response.data) {
          throw new HttpException({message: 'Сервер не отвечает'}, HttpStatus.BAD_GATEWAY)
        }
      }, 8000)
      return {
        status: 200,
        message: 'Соединение установлено'
      }
    } catch (e) {
      throw new HttpException({message: 'Сервер не отвечает'}, HttpStatus.BAD_GATEWAY)
    }
  }
}