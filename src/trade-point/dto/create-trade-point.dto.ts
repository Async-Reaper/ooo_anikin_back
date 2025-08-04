import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTradePointDto {
  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID торговой точки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly guid: string;

  @ApiProperty({ example: "г. Новокузнецк, ул. Кирова, д. 49", description: 'Наименование/адрес торговой точки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userGUID: string;

  @ApiProperty({ example: "ООО 'Куропатка' ", description: 'Наименование контрангента' })
  @IsString({ message: 'Должно быть строкой' })
  readonly counterpartyName: string;

  @ApiProperty({ example: "ИП 'Кальмар'", description: 'Наименование организации' })
  @IsString({ message: 'Должно быть строкой' })
  readonly organizationName: string;
}
