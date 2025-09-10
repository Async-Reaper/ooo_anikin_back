import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";
import { GetNomenclaturesDto } from "../../nomenclatures/dto/get-nomenclatures.dto";

export class GetFavoriteDto {
  @ApiProperty({ example: 1, description: 'ID Товара' })
  @IsInt({message: 'Должно быть число'})
  readonly id: number;

  @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
  @IsString({message: 'Должно быть строкой'})
  readonly userGUID: string;

  @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
  @IsString({message: 'Должно быть строкой'})
  readonly productGUID: string;

  @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
  @IsString({message: 'Должно быть строкой'})
  readonly product: GetNomenclaturesDto;
}

