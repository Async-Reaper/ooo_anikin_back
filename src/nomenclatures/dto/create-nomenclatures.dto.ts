import { ApiProperty } from "@nestjs/swagger";

export class CreateNomenclaturesDto {
  @ApiProperty({example: "00000-ABCDR-ab1234-00000", description: 'ID Номенклатуры'})
  readonly guid: string;

  @ApiProperty({ example: 'Салями - это идеальный перекус для настоящих гурманов!', description: 'Описание номеклатуры' })
  readonly description: string;

  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID бренда' })
  readonly brandGUID: string;

  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID группы номенклатуры' })
  readonly groupGUID: string;

  @ApiProperty({ example: 'Креветки соленые', description: 'Название номенклатуры' })
  readonly shortName: string;

  @ApiProperty({ example: false, description: 'Признак скидочного товара' })
  readonly isDiscount: boolean;

  @ApiProperty({ example: false, description: 'Признак нового товара' })
  readonly isNew: boolean;

  @ApiProperty({ example: false, description: 'Пометка на удаление' })
  readonly is_deleted: boolean;

  @ApiProperty({ example: 500, description: 'Вес' })
  readonly weight: number;

  @ApiProperty({ example: 'гр.', description: 'Метод измерения' })
  readonly measurement: string;

  @ApiProperty({ example: '120 суток (4 месяца)', description: 'Срок годности' })
  readonly expirationDate: string;

  @ApiProperty({ example: 'при температуре от 0℃ до + 6℃', description: 'условия хранения' })
  readonly storageConditions: string;
}