import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { CreateNomenclaturesDto } from "./dto/create-nomenclatures.dto";
import { Nomenclatures } from "./nomenclatures.model";
import { GetNomenclaturesDto } from "./dto/get-nomenclatures.dto";
import { Op, WhereOptions } from "sequelize";
import { UserDto } from "../auth/dto/user.dto";
import { JwtService } from "@nestjs/jwt";

const tradePoints = [
  {
    guid: "00000-dfsgs-ab1234-00000",
    nomenclatures: [
      {
        guid: "00000-AaBCsdDR-ab1234-00000",
        price: 650,
        remains: 3
      },
      {
        guid: "00000-AFSASA-ab1234-00000",
        price: 650,
        remains: 3
      }
    ]
  }
]

const nomenclaturesAdditional = [
  {
    guid: "00000-AaBCsdDR-ab1234-00000",
    info: {
      price: 650,
      remains: 3
    }
  },
  {
    guid: "00000-AFSASA-ab1234-00000",
    info: {
      price: 650,
      remains: 0
    }
  }
]

@Injectable()
export class NomenclaturesService {
  constructor(@InjectModel(Nomenclatures)
              private nomenclaturesRepository: typeof Nomenclatures,
              private jwtService: JwtService) {
  }

  async create(dto: CreateNomenclaturesDto) {
    // const fileName = await this.fileService.createFile(dto.img);
    const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid: dto.guid } });
    if (!nomenclature) {
      await this.nomenclaturesRepository.create(dto);
    } else {
      await this.nomenclaturesRepository.update(dto, { where: { guid: dto.guid } })
    }
    throw new HttpException({ message: "Номенклатура успешно создана" }, HttpStatus.OK)
  }

  async getAll(
    page: number,
    limit: number,
    tradePoint?: string,
    brands?: string[],
    group?: string,
    isDiscount?: boolean,
    isNew?: boolean,
    inStock?: boolean,
  ) {

    const where: WhereOptions<Nomenclatures> = {};

    if (group) where.groupGUID = group;
    if (brands) {
      Array.isArray(brands)
        ? (where.brandGUID = { [Op.in]: brands })
        : (where.brandGUID = brands);
    }

    where.isDiscount = isDiscount ?? false;
    where.isNew = isNew ?? false;

    const nomenclatures = await this.nomenclaturesRepository.findAll({
      limit: limit,
      offset: (page - 1) * limit,
      where
    });

    if (tradePoint) {
      const tradePointMap = new Map(
        tradePoints.map(tp => [tp.guid, tp.nomenclatures])
      );

      const result: GetNomenclaturesDto[] = (tradePointMap.get(tradePoint) || [])
        .map(tradePoint => {
          const nomenclature = nomenclatures.find(
            nomenclature => nomenclature.get({ plain: true }).guid === tradePoint.guid
          );

          if (inStock) {
            return tradePoint.remains > 0
              && (nomenclature && {
                ...nomenclature.get({ plain: true }),
                additionalInfo: {
                  price: tradePoint.price,
                  remains: tradePoint.remains
                }
              })
          }

          return nomenclature && {
            ...nomenclature.get({ plain: true }),
            additionalInfo: {
              price: tradePoint.price,
              remains: tradePoint.remains
            }
          };
        })
        .filter(Boolean) as GetNomenclaturesDto[];

      return result.length > 0
        ? result
        : new HttpException({ message: 'NOT PRODUCT' }, HttpStatus.OK);
    }

    return nomenclatures.length > 0
      ? nomenclatures
      : new HttpException({ message: 'NOT PRODUCT' }, HttpStatus.OK);
  }

  async getOne(guid: string, request: Request) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);

    const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid }, raw: true })

    if (!userGUID) return nomenclature;

    const additionalInfo =  nomenclaturesAdditional.find(add => add.guid === nomenclature.guid).info

    return {
      ...nomenclature,
      additionalInfo
    } as GetNomenclaturesDto
  }
}
