import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateGroupsDto {
  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID Группы' })
  @IsString({ message: 'Должно быть строкой' })
  readonly guid: string;

  @ApiProperty({ example: 'Закуски', description: 'Наименование группы' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;
}
