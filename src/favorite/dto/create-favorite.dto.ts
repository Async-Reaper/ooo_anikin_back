import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateFavoriteDto {
    @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
    @IsString({message: 'Должно быть строкой'})
    readonly userGUID?: string;

    @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
    @IsString({message: 'Должно быть строкой'})
    readonly productGUID?: string;
}
