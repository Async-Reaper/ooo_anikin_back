import { Column, DataType, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";

interface TradePointCreationAttrs {
    id: number;
    name: string;
    counterpartyName: string;
    organizationName: string;
}

@Table({tableName: 'trade-point'})
export class TradePoint extends Model<TradePoint, TradePointCreationAttrs> {
    @ApiProperty({ example: 32, description: 'ID тfорговой точки' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true })
    declare id: number;

    @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID торговой точки' })
    @Column({ type: DataType.STRING, unique: true, primaryKey: true })
    guid: string;

    @ApiProperty({example: 'г. Новокузнецк, ул. Кирова, д. 49', description: 'Наименование/адрес торговой точки'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: "00000-ABCDR-ab1234-00000", description: 'GUID пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    userGUID: string;

    @ApiProperty({example: "ООО 'Куропатка'" , description: 'Наименование контрангента'})
    @Column({type: DataType.STRING, allowNull: false})
    counterpartyName: string;

    @ApiProperty({example: "ИП 'Кальмар'", description: 'Наименование организации'})
    @Column({type: DataType.STRING, allowNull: false})
    organizationName: string;
}
