import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsString} from "class-validator";

export class UpdateNewsDto {
    @ApiProperty({example: 'Закуски', description: 'Наименование группы'})
    @IsString({message: 'Должно быть строкой'})
    readonly news: string;
}
