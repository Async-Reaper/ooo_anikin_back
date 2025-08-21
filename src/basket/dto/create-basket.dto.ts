import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsString, ValidateNested } from "class-validator";

export class CreateBasketDto {
  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID торговой точки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly tradePointGUID: string;

  @ApiProperty({ example: "г. Суздаль", description: 'Адрес доставки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly address: string;

  @ApiProperty({ example: [], description: 'Адрес доставки' })
  readonly items: CreateBasketItemDto[]
}

export class CreateBasketItemDto {

  @ApiProperty({ example: "00000-AaBCsdDR-ab1234-00000", description: 'GUID товара' })
  @IsString({ message: 'Должно быть строкой' })
  readonly nomenclatureGUID: string;

  @ApiProperty({ example: 2, description: 'Количество товара' })
  @IsInt({ message: 'Должно быть числом' })
  readonly count: number;
}
