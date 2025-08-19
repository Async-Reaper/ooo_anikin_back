import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { IsBase64 } from "class-validator";

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

export class CreateFileDto {

  @ApiProperty({ example: '2342442-32d3d23-234234223', description: 'GUID объекта к которому относиться изображение' })
  guid_object: string;

  @ApiProperty({
    example: PictureType.PNG,
    enum: PictureType,
    enumName: 'PictureType',
    description: 'Типы поддерживаемых изображений'
  })
  picture_type: string

  @ApiProperty({ example: "base64:wefqeqeef", description: 'Категория картинки' })
  binary_image: string

  @ApiProperty({
    example: PictureCategory.GROUPS,
    enum: PictureCategory,
    enumName: 'PictureCategory',
    description: 'Категория картинки'
  })
  picture_category: string

  @ApiProperty({ example: 'Закуски', description: 'Название файла с типом' })
  file_name: string

  @ApiProperty({ example: false, description: 'Признак того что картинка помечена на удаление' })
  is_deleted: boolean

  @ApiProperty({ example: true, description: 'Признак того что картинка являеться главной' })
  is_main: boolean
}
