import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty({ example: 'login', description: 'Логин' })
    readonly login: string;

    @ApiProperty({ example: 'passwords', description: 'Пароль' })
    readonly password: string;
}
