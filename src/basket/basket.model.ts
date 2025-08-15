import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";
import { TradePoint } from "../trade-point/trade-point.model";

interface BasketCreationAttrs {
  userGUID: string;
  tradePointGUID: string;
  address: string;
  items: BasketItemCreationAttrs[]
}

interface BasketItemCreationAttrs {
  basketId: number;
  nomenclatureGUID: string;
  count: number;
  price: number;
}

// Таблица корзины (основная информация)
@Table({ tableName: 'basket' })
export class Basket extends Model<Basket, BasketCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => TradePoint)
  @ApiProperty({ description: 'GUID торговой точки' })
  @Column({ type: DataType.STRING, allowNull: false })
  tradePointGUID: string;

  @ApiProperty({ description: 'GUID пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  userGUID: string;

  @ApiProperty({ description: 'Адрес доставки' })
  @Column({ type: DataType.STRING })
  address: string;

  @HasMany(() => BasketItem)
  items: BasketItem[];

  @BelongsTo(() => TradePoint)
  tradePoint: TradePoint;
}

// Таблица позиций в корзине
@Table({ tableName: 'basket_items' })
export class BasketItem extends Model<BasketItem, BasketItemCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => Basket)
  @ApiProperty({ description: 'ID Родительской сущности корзины' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  basketId: number;

  @ForeignKey(() => Nomenclatures)
  @ApiProperty({ description: 'GUID товара' })
  @Column({ type: DataType.STRING, allowNull: false })
  nomenclatureGUID: string;

  @ApiProperty({ description: 'Количество товара' })
  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  count: number;

  @BelongsTo(() => Nomenclatures)
  nomenclature: Nomenclatures;
}
