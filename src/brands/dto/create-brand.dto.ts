import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateBrandDto {

    @ApiProperty({example: "00000-ABCDR-ab1234-00000", description: 'ID Бренда'})
    @IsString({message: 'Должно быть строкой'})
    readonly guid: string;

    @ApiProperty({example: 'Лейз', description: 'Наименование бренда'})
    @IsString({message: 'Должно быть строкой'})
    readonly name: string;

    @ApiProperty({ example: false, description: 'Пометка на удаление' })
    @IsBoolean({ message: 'Должно быть булево значение' })
    readonly is_deleted: boolean;
}
