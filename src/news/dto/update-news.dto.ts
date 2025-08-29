import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateNewsDto {
    @ApiProperty({example: 'Какая-то новость', description: 'Наименование группы'})
    @IsString({message: 'Должно быть строкой'})
    readonly news: string;
}
