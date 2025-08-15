import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({ example: 'login', description: 'Логин' })
  @IsString({ message: 'Должно быть строкой' })
  readonly login: string;

  @ApiProperty({ example: 'password', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  readonly password: string;
}
