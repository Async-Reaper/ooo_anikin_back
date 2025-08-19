import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Brand } from "../brands/brand.model";
import { Group } from "../groups/groups.model";

interface NomenclaturesCreationAttrs {
    guid: string;
    brandGUID: string;
    groupGUID: string;
    description: string;
    shortName: string;
    weight: number;
    measurement: string;
    expirationDate: string;
    storageConditions: string;
    isDiscount: boolean;
    isNew: boolean;
    is_deleted: boolean;
}

@Table({tableName: 'nomenclatures'})
export class Nomenclatures extends Model<Nomenclatures, NomenclaturesCreationAttrs> {
    @ApiProperty({ example: "00000-ABCDR-ab1234-00000", description: 'GUID Номеклатуры' })
    @Column({ type: DataType.STRING, unique: true, primaryKey: true })
    guid: string;

    @ForeignKey(() => Brand)
    @ApiProperty({example: "00000-ABCDR-ab1234-00000", description: 'GUID бренда'})
    @Column({type: DataType.STRING, allowNull: true})
    brandGUID: string;

    @BelongsTo(() => Brand, 'brand')
    brandAssociation: Brand

    @ForeignKey(() => Group)
    @ApiProperty({example: "00000-ABCDR-ab1234-00000", description: 'GUID группы'})
    @Column({type: DataType.STRING, allowNull: true})
    groupGUID: string;

    @BelongsTo(() => Group, 'group')
    groupAssociation: Group

    @ApiProperty({example: 'avad.jpg', description: 'Изображение'})
    @Column({type: DataType.STRING, unique: false, allowNull: true})
    img: string;

    @ApiProperty({example: 'Какое-то описание....', description: 'Описание'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string;

    @ApiProperty({example: 'какое-то название', description: 'Краткое название'})
    @Column({type: DataType.STRING, allowNull: true})
    shortName: string;

    @ApiProperty({example: true, description: 'Скидочный товар'})
    @Column({type: DataType.BOOLEAN, allowNull: true})
    isDiscount: boolean;

    @ApiProperty({example: false, description: 'Новый товар'})
    @Column({type: DataType.BOOLEAN, allowNull: true})
    isNew: boolean;

    @ApiProperty({example: false, description: 'Пометка на удаление'})
    @Column({type: DataType.BOOLEAN, allowNull: true})
    is_deleted: boolean;

    @ApiProperty({example: 500, description: 'Вес'})
    @Column({type: DataType.INTEGER, allowNull: true})
    weight: number;

    @ApiProperty({example: "гр", description: 'Метод измерения'})
    @Column({type: DataType.STRING, allowNull: true})
    measurement: string;

    @ApiProperty({example: "120 суток (4 месяца)", description: 'Срок годности'})
    @Column({type: DataType.STRING, allowNull: true})
    expirationDate: string;

    @ApiProperty({example: "при температуре от 0℃ до + 6℃", description: 'Условия хранения'})
    @Column({type: DataType.STRING, allowNull: true})
    storageConditions: string;
}

