import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";

export interface FavoriteCreationAttrs {
  userGUID: string;
  productGUID: string;
}

@Table({ tableName: 'favorite' })
export class Favorite extends Model<Favorite, FavoriteCreationAttrs> {
  @ApiProperty({ example: 1, description: 'ID новости' })
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true })
  declare id: number;

  @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  userGUID: string;

  @ForeignKey(() => Nomenclatures)
  @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID товара' })
  @Column({ type: DataType.STRING, allowNull: false })
  productGUID: string;

  @BelongsTo(() => Nomenclatures)
  product: Nomenclatures;
}
