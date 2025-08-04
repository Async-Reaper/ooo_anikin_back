import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Brand } from "../brands/brand.model";
import { Group } from "../groups/groups.model";

interface NomenclaturesCreationAttrs {
    guid: string;
    brandGUID: number;
    groupGUID: number;
    img: string;
    description: string;
    shortName: string;
    weight: number;
    measurement: string;
    expirationDate: string;
    storageConditions: string;
    isDiscount: boolean;
}

@Table({tableName: 'nomenclatures'})
export class Nomenclatures extends Model<Nomenclatures, NomenclaturesCreationAttrs> {
    @ApiProperty({ example: 32, description: 'ID Номеклатуры' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true })
    id: number;

    @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID Номеклатуры' })
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true })
    guid: string;

    @ForeignKey(() => Brand)
    @ApiProperty({example: 1, description: 'ID бренда'})
    @Column({type: DataType.STRING, allowNull: false})
    brandGUID: string;

    @BelongsTo(() => Brand, 'brand')
    brandAssociation: Brand

    @ForeignKey(() => Group)
    @ApiProperty({example: 1, description: 'ID группы'})
    @Column({type: DataType.STRING, allowNull: false})
    groupGUID: string;

    @BelongsTo(() => Group, 'group')
    groupAssociation: Group

    @ApiProperty({example: 'ava.jpg', description: 'Изображение'})
    @Column({type: DataType.STRING, unique: false, allowNull: false})
    img: string;

    @ApiProperty({example: 'Какое-то описание....', description: 'Описание'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @ApiProperty({example: 'какое-то название', description: 'Краткое название'})
    @Column({type: DataType.STRING, allowNull: false})
    shortName: string;

    @ApiProperty({example: true, description: 'скидочный товар'})
    @Column({type: DataType.BOOLEAN, allowNull: false})
    isDiscount: boolean;

    @ApiProperty({example: 500, description: 'Вес'})
    @Column({type: DataType.INTEGER, allowNull: false})
    weight: number;

    @ApiProperty({example: "гр", description: 'Метод измерения'})
    @Column({type: DataType.STRING, allowNull: false})
    measurement: string;

    @ApiProperty({example: "120 суток (4 месяца)", description: 'Срок годности'})
    @Column({type: DataType.STRING, allowNull: false})
    expirationDate: string;

    @ApiProperty({example: "при температуре от 0℃ до + 6℃", description: 'Условия хранения'})
    @Column({type: DataType.STRING, allowNull: false})
    storageConditions: string;
}

