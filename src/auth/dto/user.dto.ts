import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({ example: 'userName', description: 'Логин' })
  readonly userName: string;

  @ApiProperty({ example: 'userGUID', description: 'Пароль' })
  readonly userGUID: string;

  @ApiProperty({ example: 4324, description: 'Задолженность' })
  readonly debts: number;

  @ApiProperty({ example: 'admin', description: 'Роль пользователя' })
  readonly role: "admin" | "buyer";

  @ApiProperty({ example: 'admin', description: 'Роль пользователя' })
  readonly typeOfBase: "main" | "additiona";

  @ApiProperty({ example: false, description: 'Тип покупателя' })
  readonly country: boolean

  @ApiProperty({ example: false, description: 'Признак контроля остатков' })
  readonly isNotControlRemains: boolean
}

export class UsersListDto {

  @ApiProperty({ example: 'userName', description: 'Логин' })
  readonly userName: string;

  @ApiProperty({ example: 'userGUID', description: 'Пароль' })
  readonly userGUID: string;
}