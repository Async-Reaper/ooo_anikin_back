import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { CreateNomenclaturesDto } from "./dto/create-nomenclatures.dto";
import { Nomenclatures } from "./nomenclatures.model";
import { GetNomenclaturesDto } from "./dto/get-nomenclatures.dto";
import { Op, WhereOptions } from "sequelize";
import { UserDto } from "../auth/dto/user.dto";
import { JwtService } from "@nestjs/jwt";
import { raw, Response } from "express";
import axios from "axios";
import process from "node:process";

interface ProductAdditionalInfo {
  product_guid: string,
  remains: number;
  weight: number;
  price: number;
  discount: number;
  priceWithoutDiscount: number;
  discountAvailable: boolean
}

@Injectable()
export class NomenclaturesService {
  constructor(@InjectModel(Nomenclatures)
              private nomenclaturesRepository: typeof Nomenclatures,
              private jwtService: JwtService) {
  }

  async create(dto: CreateNomenclaturesDto) {
    try {
      const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid: dto.guid, is_deleted: false }, raw: true });
      if (!nomenclature.get({ plain: true })) {
        await this.nomenclaturesRepository.create(dto);
        console.log(dto)
      } else {
        await this.nomenclaturesRepository.update(dto, { where: { guid: dto.guid } })
        console.log(dto)
      }
      return new HttpException({ message: "Номенклатура успешно создана" }, HttpStatus.OK)
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST)
    }
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

    const nomenclatures = await this.nomenclaturesRepository.findAll({
      limit: limit,
      offset: (page - 1) * limit,
      where: {
        ...where,
        // is_deleted: false
      },
      raw: true
    });

    const totalCount = await this.nomenclaturesRepository.count({ where });

    response.header('X-Total-Count', totalCount.toString());
    response.header('Access-Control-Expose-Headers', 'X-Total-Count');

    if (tradePoint && token) {
      const nomenclaturesGuid: string[] = nomenclatures.map(nomenclature => nomenclature.guid);

      const productPrices: ProductAdditionalInfo[] = await this.getAdditionalInfo(nomenclaturesGuid, tradePoint);

      const result: GetNomenclaturesDto[] = productPrices.map(productPrice => {
        const nomenclature = nomenclatures.find(
          nomenclature => nomenclature.guid === productPrice.product_guid
        );

        if (inStock) {
          return productPrice.remains > 0
            && (nomenclature && {
              ...nomenclature,
              additionalInfo: {
                price: productPrice.priceWithoutDiscount >= productPrice.price ? productPrice.price : productPrice.priceWithoutDiscount,
                oldPrice: productPrice.priceWithoutDiscount >= productPrice.price && productPrice.price,
                remains: productPrice.remains
              }
            })
        }

        return nomenclature && {
          ...nomenclature,
          additionalInfo: {
            price: productPrice.priceWithoutDiscount >= productPrice.price ? productPrice.price : productPrice.priceWithoutDiscount,
            oldPrice: productPrice.priceWithoutDiscount >= productPrice.price && productPrice.price,
            remains: productPrice.remains
          }
        };
      })
        .filter(Boolean) as GetNomenclaturesDto[];
      return result
    }

    return nomenclatures
  }


  async getOne(guid: string, contractGuid: string, request: Request) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);

    const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid }, raw: true })

    if (!userGUID) return nomenclature;

    const {
      price,
      remains,
      priceWithoutDiscount
    }: ProductAdditionalInfo = await this.getAdditionalInfo(nomenclature.guid, contractGuid);

    return {
      ...nomenclature,
      additionalInfo: {
        price: priceWithoutDiscount >= price ? price : priceWithoutDiscount,
        oldPrice: priceWithoutDiscount >= price && price,
        remains: remains
        // price: 43242,
        // oldPrice: 43242,
        // remains: 43242,
      }
    } as GetNomenclaturesDto
  }

  async delete(guid: string) {
    await this.nomenclaturesRepository.destroy({ where: { guid } })

    return { message: "Номеклатура удалена." }
  }

  /**
   * @param guid гуид товара, может быть несколько значений
   * @param contractGUID гуид торговой точки
   */
  async getAdditionalInfo(guid: string | string[], contractGUID: string) {
    // const url = process.env.URL_1C + "/nomenclatures/currentData";
    const url = "http://192.168.1.95/ut_test_copy/hs/api_v2/nomenclatures/currentData";
    const response = await axios.post(url, {
      productItems: guid,
      contractGUID: contractGUID
    })
    console.log(response)
    return response.data;
    // return [];
  }
}
