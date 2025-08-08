import { CreateNomenclaturesDto } from "./create-nomenclatures.dto";
import { ApiProperty } from "@nestjs/swagger";

export class GetNomenclaturesDto extends CreateNomenclaturesDto {
  readonly additionalInfo?: {
    price: number,
    remains: number
  }
}