import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { CreateNomenclaturesDto } from "./dto/create-nomenclatures.dto";
import { Nomenclatures } from "./nomenclatures.model";
import { GetNomenclaturesDto } from "./dto/get-nomenclatures.dto";
import { Op, WhereOptions } from "sequelize";
import { UserDto } from "../auth/dto/user.dto";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

const tradePoints = [
  {
    guid: "00000-ABCDR-ab1234-00000",
    nomenclatures: [
      {
        guid: "00000-ASDASA-ab1234-00000",
        price: 13454,
        remains: 3
      },
      {
        guid: "00000-casas-ab1234-00000",
        price: 134,
        remains: 3
      }
    ]
  },
  {
    guid: "00000-dfsgs-ab1234-00000",
    nomenclatures: [
      {
        guid: "asdfasf-casas-ab1234-00000",
        price: 3421,
        remains: 3
      },
      {
        guid: "00000-AaBCsdDR-ab1234-00000",
        price: 1234,
        remains: 3
      },
      {
        guid: "00000-ABCDR-ab1234-00000",
        price: 2345,
        oldPrice: 3245,
        remains: 3
      },
      {
        guid: "00000-sadfABCDR-ab1234-00000",
        price: 4235,
        oldPrice: 6341,
        remains: 3
      }
    ]
  },
]

const nomenclaturesAdditional = [
  {
    guid: "asdfasf-casas-ab1234-00000",
    info: {
      price: 23,
      remains: 3
    },
  },
  {
    guid: "00000-AaBCsdDR-ab1234-00000",
    info: {
      price: 441,
      remains: 3
    }
  },
  {
    guid: "00000-ABCDR-ab1234-00000",
    info: {
      price: 1234,
      oldPrice: 2411,
      remains: 3
    }
  },
  {
    guid: "00000-sadfABCDR-ab1234-00000",
    info: {
      price: 432,
      oldPrice: 1200,
      remains: 3
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
    const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid: dto.guid }, raw: true });
    await this.nomenclaturesRepository.create(dto);
    if (!nomenclature) {
      console.log(dto)
    } else {
      await this.nomenclaturesRepository.update(dto, { where: { guid: dto.guid } })
      console.log(dto)
    }
    throw new HttpException({ message: "Номенклатура успешно создана" }, HttpStatus.OK)
  }

  async getAll(
    request: Request,
    response: Response,
    page: number,
    limit: number,
    tradePoint?: string,
    brands?: string[],
    group?: string,
    isDiscount?: boolean,
    isNew?: boolean,
    inStock?: boolean,
  ) {
    const token = request.headers['authorization'];

    const where: WhereOptions<Nomenclatures> = {};

    if (group) where.groupGUID = group;
    if (brands) {
      Array.isArray(brands)
        ? (where.brandGUID = { [Op.in]: brands })
        : (where.brandGUID = brands);
    }

    isDiscount && (where.isDiscount = isDiscount);

    isNew && (where.isNew = isNew);

    const nomenclaturesFromDb = await this.nomenclaturesRepository.findAll({
      limit: limit,
      offset: (page - 1) * limit,
      where
    });

    const totalCount = await this.nomenclaturesRepository.count({ where });

    response.header('X-Total-Count', totalCount.toString());
    response.header('Access-Control-Expose-Headers', 'X-Total-Count');

    if (tradePoint && token) {
      const tradePointProducts = tradePoints.find(tradePointItem => tradePointItem.guid === tradePoint).nomenclatures


      const nomenclaturesForTradePoint = await this.nomenclaturesRepository.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        where: {
          ...where,
          guid: { [Op.in]: (tradePointProducts.map(product => product.guid)) }
        }
      });
      const totalCountWithTradePoint = await this.nomenclaturesRepository.count({
        where:
          {
            ...where,
            guid: { [Op.in]: (tradePointProducts.map(product => product.guid)) }
          }
      });

      const result: GetNomenclaturesDto[] = tradePointProducts.map(tradePoint => {
        const nomenclature = nomenclaturesForTradePoint.find(
          nomenclature => nomenclature.get({ plain: true }).guid === tradePoint.guid
        );

        if (inStock) {
          return tradePoint.remains > 0
            && (nomenclature && {
              ...nomenclature.get({ plain: true }),
              additionalInfo: {
                price: tradePoint.price,
                oldPrice: tradePoint.oldPrice,
                remains: tradePoint.remains
              }
            })
        }

        return nomenclature && {
          ...nomenclature.get({ plain: true }),
          additionalInfo: {
            price: tradePoint.price,
            oldPrice: tradePoint.oldPrice,
            remains: tradePoint.remains
          }
        };
      })
        .filter(Boolean) as GetNomenclaturesDto[];

      response.header('X-Total-Count', totalCountWithTradePoint.toString());
      return result
    }

    return nomenclaturesFromDb
  }


  async getOne(guid: string, request: Request) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);

    const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid }, raw: true })

    if (!userGUID) return nomenclature;

    const additionalInfo = nomenclaturesAdditional.find(add => add.guid === nomenclature.guid).info

    return {
      ...nomenclature,
      additionalInfo
    } as GetNomenclaturesDto
  }

  async delete(guid: string) {
    await this.nomenclaturesRepository.destroy({ where: { guid } })

    return { message: "Номеклатура удалена." }
  }
}
