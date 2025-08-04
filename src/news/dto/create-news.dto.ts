import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsString} from "class-validator";

export class CreateNewsDto {
    @ApiProperty({example: 32, description: 'ID группы'})
    @IsInt({message: 'Должно быть строкой'})
    readonly id: number;

    @ApiProperty({example: 'Закуски', description: 'Наименование группы'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;


}
