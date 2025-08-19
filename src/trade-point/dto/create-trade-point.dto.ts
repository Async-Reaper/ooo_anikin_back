import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateTradePointDto {
  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID торговой точки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly guid: string;

  @ApiProperty({ example: "г. Новокузнецк, ул. Кирова, д. 49", description: 'Наименование/адрес торговой точки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly counterpartyGuid: string;

  @ApiProperty({ example: "ООО 'Куропатка' ", description: 'Наименование контрангента' })
  @IsString({ message: 'Должно быть строкой' })
  readonly counterpartyName: string;

  @ApiProperty({ example: "ИП 'Кальмар'", description: 'Наименование организации' })
  @IsString({ message: 'Должно быть строкой' })
  readonly organizationName: string;

  @ApiProperty({ example: false, description: 'Пометка на удаление' })
  @IsBoolean({ message: 'Должно быть булево значение' })
  readonly is_deleted: boolean
}
