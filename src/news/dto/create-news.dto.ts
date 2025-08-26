import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsString} from "class-validator";

export class CreateNewsDto {
    @ApiProperty({example: 'Какая-то новость', description: 'Наименование группы'})
    @IsString({message: 'Должно быть строкой'})
    readonly news: string;

    @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
    @IsString({message: 'Должно быть строкой'})
    readonly userGUID?: string;
}
