import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";

interface BrandCreationAttrs {
  id: number;
  guid: string;
  name: string;
}

@Table({ tableName: 'brands' })
export class Brand extends Model<Brand, BrandCreationAttrs> {
  @ApiProperty({ example: 32, description: 'ID Бренда' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true })
  id: number;

  @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID Бренда' })
  @Column({ type: DataType.STRING, unique: true, primaryKey: true })
  guid: string;

  @ApiProperty({ example: 'Лейз', description: 'Наименование бренда' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @HasMany(() => Nomenclatures)
  nomenclatures: Nomenclatures[]
}
