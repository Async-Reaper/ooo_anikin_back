import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";

interface FilesCreationAttrs {
  id: number;
  guid: string;
  name: string;
}

enum PictureType {
  JPG = "jpg",
  PNG = "png",
  GIF = "gif",
  JPEG = "jpeg",
  TIF = "tiff",
}

enum PictureCategory {
  GROUPS = "groups",
  NOMENCLATURE_GROUPS = "nomenclature_groups",
  NOMENCLATURES = "nomenclatures",
  BRANDS = "brands",
}

@Table({ tableName: 'files' })
export class Files extends Model<Files, FilesCreationAttrs> {
  @ApiProperty({ example: 32, description: 'ID Группы' })
  @Column({ type: DataType.INTEGER, primaryKey: true, unique: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({ example: '2342442-32d3d23-234234223', description: 'GUID объекта к которому относиться изображение' })
  @Column({ type: DataType.STRING, allowNull: false })
  guid_object: string;

  @ApiProperty({
    example: PictureType.PNG,
    enum: PictureType,
    enumName: 'PictureType',
    description: 'Типы поддерживаемых изображений'
  })
  @Column({ type: DataType.ENUM(...Object.values(PictureType)), allowNull: false })
  picture_type: string

  @ApiProperty({ example: PictureCategory.GROUPS, enum: PictureCategory, enumName: 'PictureCategory',description: 'Категория картинки' })
  @Column({ type: DataType.ENUM(...Object.values(PictureCategory)), allowNull: false })
  picture_category: string

  @ApiProperty({ example: 'Закуски', description: 'Название файла с типом' })
  @Column({ type: DataType.STRING, allowNull: false })
  file_name: string

  @ApiProperty({ example: '/path/image/test.png', description: 'Путь до изображения' })
  @Column({ type: DataType.STRING, allowNull: false })
  path: string

  @ApiProperty({ example: false, description: 'Признак того что картинка помечена на удаление' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_deleted: boolean

  @ApiProperty({ example: true, description: 'Признак того что картинка являеться главной' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  is_main: boolean
}
