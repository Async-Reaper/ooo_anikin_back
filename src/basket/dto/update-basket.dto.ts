import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class UpdateBasketDto {

  @ApiProperty({ example: "г. Суздаль", description: 'Адрес доставки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly address: string;

}

export class UpdateBasketItemDto {

  @ApiProperty({ example: 2, description: 'Количество товара' })
  @IsInt({ message: 'Должно быть числом' })
  readonly count: number;

}