import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

class OrderHeader {

  @ApiProperty({ example: "вфаыасаыфв0фывафыа", description: 'ГУИД Пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  readonly userGUID: string

  @ApiProperty({ example: "фыавы-ывафыва-324", description: 'ГУИД Торговой точки' })
  @IsString({ message: 'Должно быть строкой' })
  readonly contractGUID: string

  @ApiProperty({ example: "Какой-то комментарий", description: 'Комментарий' })
  @IsString({ message: 'Должно быть строкой' })
  readonly comment: string;

  @ApiProperty({ example: "28.09.2025", description: 'Дата отгрузки' })
  readonly dateShipment: string;
}

class OrderProducts {
  @ApiProperty({ example: "вфаыасаыфв0фывафыа", description: 'Гуид товара' })
  @IsString({ message: 'Должно быть строкой' })
  readonly product_guid: string;

  @ApiProperty({ example: 45, description: 'Количество товара' })
  @IsInt({ message: 'Должно быть числом' })
  readonly count: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 2, description: 'ID корзины' })
  readonly basketId: number;

  @ApiProperty({ example: OrderHeader, description: 'Шапка заказа' })
  readonly header: OrderHeader;

  @ApiProperty({ example: OrderProducts, description: 'Список товара' })
  readonly products: OrderProducts[];
}