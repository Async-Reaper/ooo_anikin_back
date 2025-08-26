import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface NewsCreationAttrs {
  id: number;
  news: string;
}

@Table({ tableName: 'news' })
export class News extends Model<News, NewsCreationAttrs> {
  @ApiProperty({ example: 1, description: 'ID новости' })
  @Column({ type: DataType.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true })
  declare id: number;

  @ApiProperty({ example: 'Какая-то новость', description: 'Текст новости' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  news: string;

  @ApiProperty({ example: 'af48a69c-15f1-11ec-890e-f0795994adc6', description: 'GUID Пользователя' })
  @Column({ type: DataType.STRING, allowNull: false })
  userGUID: string;
}
