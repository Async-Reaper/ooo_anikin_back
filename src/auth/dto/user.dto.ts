import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserDto {
  @ApiProperty({ example: 'userName', description: 'Логин' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userName: string;

  @ApiProperty({ example: 'userGUID', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userGUID: string;
}
