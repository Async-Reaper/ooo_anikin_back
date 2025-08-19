import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";

interface GroupCreationAttrs {
  id: number;
  guid: string;
  name: string;
  is_deleted: boolean;
}

@Table({ tableName: 'groups' })
export class Group extends Model<Group, GroupCreationAttrs> {
  @ApiProperty({ example: 32, description: 'ID Группы' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({ example: "00000-аABCDR-ab1234-00000", description: 'GUID Группы' })
  @Column({ type: DataType.STRING, unique: true, primaryKey: true })
  guid: string;

  @ApiProperty({ example: 'Закуски', description: 'Наименование группы' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @ApiProperty({ example: false, description: 'Наименование группы' })
  @Column({ type: DataType.BOOLEAN })
  is_deleted: boolean;

  @HasMany(() => Nomenclatures)
  nomenclatures: Nomenclatures[]
}
