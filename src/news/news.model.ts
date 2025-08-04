import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface NewsCreationAttrs {
  id: number;
  news: string;
}

@Table({ tableName: 'news' })
export class News extends Model<News, NewsCreationAttrs> {
  @ApiProperty({ example: 32, description: 'ID Бренда' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'Какая-то новость', description: 'Текст новости' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  news: string;
}
