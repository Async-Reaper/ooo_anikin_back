import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class UserDto {
  @ApiProperty({ example: 'userName', description: 'Логин' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userName: string;

  @ApiProperty({ example: 'userGUID', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userGUID: string;

  @ApiProperty({ example: 4324, description: 'Задолженность' })
  @IsInt({ message: 'Должно быть числом' })
  readonly debts: number;

  @ApiProperty({ example: 'admin', description: 'Роль пользователя' })
  @IsInt({ message: 'Должно быть числом' })
  readonly role: "admin" | "buyer";

  @ApiProperty({ example: 'admin', description: 'Роль пользователя' })
  @IsInt({ message: 'Должно быть числом' })
  readonly typeOfBase: "main" | "additional";
}

export class UsersListDto {

  @ApiProperty({ example: 'userName', description: 'Логин' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userName: string;

  @ApiProperty({ example: 'userGUID', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userGUID: string;
}