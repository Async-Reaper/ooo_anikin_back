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
import { ConfigService } from "@nestjs/config";

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
              private jwtService: JwtService,
              private configService: ConfigService) {
  }

  async create(dto: CreateNomenclaturesDto) {
    try {
      const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid: dto.guid }, raw: true });
      if (!nomenclature) {
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
    searchValue?: string,
  ) {
    console.log('=== DEBUG PARAMS ===');
    console.log('inStock:', inStock);
    console.log('page:', page);
    console.log('limit:', limit);
    console.log('tradePoint:', tradePoint);
    const token = request.headers['authorization'];
    const { typeOfBase }: UserDto = this.jwtService.decode(token);

    const where: WhereOptions<Nomenclatures> = {};

    if (group) where.groupGUID = group;
    if (brands) {
      Array.isArray(brands)
        ? (where.brandGUID = { [Op.in]: brands })
        : (where.brandGUID = brands);
    }

    if (isNew) {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 31);

      // Добавляем условие что createdAt >= 15 дней назад
      where.createdAt = {
        [Op.gte]: fifteenDaysAgo
      };
    }

    isDiscount && (where.isDiscount = isDiscount);
    where.typeOfBase = typeOfBase;

    let nomenclatures: Nomenclatures[] = [];
    let totalCount: number;

    if (searchValue) {
      // ✅ ИСПОЛЬЗУЕМ НЕЧЕТКИЙ ПОИСК здесь!
      const allNomenclatures = await this.nomenclaturesRepository.findAll({
        where: {
          ...where,
          is_deleted: false
        },
        raw: true
      });

      // ✅ ФИЛЬТРУЕМ с помощью quickSimilarity
      const filteredNomenclatures = allNomenclatures.filter(nomenclature =>
        this.quickSimilarity(searchValue, nomenclature.shortName)
      );

      totalCount = filteredNomenclatures.length;

      // Пагинация
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      nomenclatures = filteredNomenclatures.slice(startIndex, endIndex);

    } else {
      // Обычная логика без поиска
      nomenclatures = await this.nomenclaturesRepository.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        where: { ...where, is_deleted: false },
        raw: true
      });

      totalCount = await this.nomenclaturesRepository.count({
        where: { ...where, is_deleted: false }
      });
    }

    // ЕСЛИ НЕТ tradePoint - возвращаем сразу
    if (!tradePoint) {
      response.header('X-Total-Count', totalCount.toString());
      response.header('Access-Control-Expose-Headers', 'X-Total-Count');
      return nomenclatures;
    }

    let finalNomenclatures = nomenclatures;
    let finalTotalCount = totalCount;
    let productPrices = await this.getAdditionalInfo(
      nomenclatures.map(n => n.guid),
      tradePoint,
      typeOfBase
    );

    // ЕСЛИ ФИЛЬТРУЕМ ПО ОСТАТКАМ
    if (inStock.toString() === 'true') {
      // 1. Получаем ВСЕ товары по фильтрам (без пагинации)
      const allNomenclatures = await this.nomenclaturesRepository.findAll({
        where: { ...where, is_deleted: false },
        attributes: ['guid'],
        raw: true
      });

      // 2. Получаем остатки для ВСЕХ товаров
      const allProductPrices = await this.getAdditionalInfo(
        allNomenclatures.map(n => n.guid),
        tradePoint,
        typeOfBase
      );

      // 3. Фильтруем только те, что в наличии
      const inStockProductPrices = allProductPrices.filter(p => p.remains > 0);
      finalTotalCount = inStockProductPrices.length;

      // 4. ПАГИНАЦИЯ: берем только нужную страницу
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pagedProductPrices = inStockProductPrices.slice(startIndex, endIndex);

      // 5. Получаем данные только для страницы
      const pagedGuids = pagedProductPrices.map(p => p.product_guid);
      finalNomenclatures = await this.nomenclaturesRepository.findAll({
        limit,
        offset: (page - 1) * limit,
        where: {
          guid: { [Op.in]: pagedGuids },
          ...where,
          is_deleted: false
        },
        raw: true
      });

      productPrices = pagedProductPrices;
    }

    response.header('X-Total-Count', finalTotalCount.toString());
    response.header('Access-Control-Expose-Headers', 'X-Total-Count');

    return this.processNomenclatures(finalNomenclatures, productPrices, inStock);
  }

// ✅ Вот та самая функция быстрого нечеткого поиска
  private quickSimilarity(query: string, text: string): boolean {
    if (!query || !text) return false;

    const cleanQuery = query.toLowerCase().trim();
    const cleanText = text.toLowerCase().trim();

    // Если запрос пустой
    if (cleanQuery === '') return true;

    // Точное совпадение
    if (cleanText.includes(cleanQuery)) return true;

    // Common mistakes mapping
    const commonMistakes: { [key: string]: string[] } = {
      'а': ['a'],
      'в': ['b'],
      'е': ['e'],
      'ё': ['e'],
      'з': ['3', 'z'],
      'и': ['i', 'u'],
      'й': ['i', 'y'],
      'к': ['k'],
      'м': ['m'],
      'н': ['h'],
      'о': ['o', '0'],
      'п': ['n', 'p'],
      'р': ['p', 'r'],
      'с': ['c', 's'],
      'т': ['t'],
      'у': ['y', 'u'],
      'х': ['x', 'h'],
      ' ': ['-', '_', '']
    };

    // Проверяем разные варианты написания
    for (let i = 0; i <= cleanText.length - cleanQuery.length; i++) {
      let matches = 0;
      let totalChars = 0;

      for (let j = 0; j < cleanQuery.length; j++) {
        const queryChar = cleanQuery[j];
        const textChar = cleanText[i + j];

        if (queryChar === textChar) {
          matches++;
        } else if (commonMistakes[queryChar]?.includes(textChar)) {
          matches++;
        } else if (commonMistakes[textChar]?.includes(queryChar)) {
          matches++;
        }

        totalChars++;
      }

      // Если совпало более 70% символов с учетом возможных ошибок
      if (matches / totalChars >= 0.7) {
        return true;
      }
    }

    return false;
  }

// Вспомогательный метод для обработки номенклатур
  private processNomenclatures(
    nomenclatures: Nomenclatures[],
    productPrices: ProductAdditionalInfo[],
    inStock?: boolean
  ): GetNomenclaturesDto[] {
    return productPrices
      .map(productPrice => {
        const nomenclature = nomenclatures.find(
          n => n.guid === productPrice.product_guid
        );

        if (!nomenclature) return null;

        // Проверка наличия на складе
        if (String(inStock) === 'true' && productPrice.remains <= 0) {
          return null;
        }

        return {
          ...nomenclature,
          additionalInfo: {
            price: productPrice.price,
            oldPrice: productPrice.priceWithoutDiscount,
            remains: productPrice.remains
          }
        };
      })
      .filter(Boolean) as GetNomenclaturesDto[];
  }


  async getOne(request: Request, guid: string, contractGuid?: string) {
    const token = request.headers['authorization'];
    const { typeOfBase }: UserDto = this.jwtService.decode(token)

    const nomenclature = await this.nomenclaturesRepository.findOne({ where: { guid, typeOfBase }, raw: true })

    if (!contractGuid) return nomenclature;

    try {
      const {
        price,
        remains,
        priceWithoutDiscount
      }: ProductAdditionalInfo = await this.getAdditionalInfo(nomenclature.guid, contractGuid, typeOfBase);

      return {
        ...nomenclature,
        additionalInfo: {
          price: priceWithoutDiscount >= price ? price : priceWithoutDiscount,
          oldPrice: priceWithoutDiscount >= price && price,
          remains: remains
        }
      } as GetNomenclaturesDto
    } catch (e) {
      return nomenclature;
    }
  }

  async getSimilar(request: Request, productGUID: string, groupGUID: string, contractGuid?: string) {
    const token = request.headers['authorization'];
    const { typeOfBase }: UserDto = this.jwtService.decode(token)

    const nomenclatures = await this.nomenclaturesRepository.findAll({
      offset: 0,
      limit: 3,
      where: {
        groupGUID,
        typeOfBase,
        guid: {
          [Op.ne]: productGUID,
        }
      },
      raw: true
    })

    if (contractGuid) {
      const nomenclatureGUIDS = nomenclatures.map(nomenclature => nomenclature.guid);
      try {
        const prices: ProductAdditionalInfo[] = await this.getAdditionalInfo(nomenclatureGUIDS, contractGuid, typeOfBase);
        // console.log(prices)
        const nomenclaturesWithPrice: GetNomenclaturesDto[] = nomenclatures.map(nomenclature => {
          const findPrice = prices.find(price => price.product_guid === nomenclature.guid)

          return {
            ...nomenclature,
            additionalInfo: {
              price: findPrice.priceWithoutDiscount >= findPrice.price ? findPrice.price : findPrice.priceWithoutDiscount,
              oldPrice: findPrice.priceWithoutDiscount >= findPrice.price && findPrice.price,
              remains: findPrice.remains
            }
          } as GetNomenclaturesDto
        })

        return nomenclaturesWithPrice;
      } catch (e) {
        console.log(e.message)
        return nomenclatures
      }
    }

    return nomenclatures;
  }

  async delete(guid: string) {
    await this.nomenclaturesRepository.destroy({ where: { guid } })

    return { message: "Номеклатура удалена." }
  }

  async updateAll() {
    const nomenclatures = await this.nomenclaturesRepository.findAll({raw: true});

    await Promise.all(
      nomenclatures.map(nomenclature => this.nomenclaturesRepository.update(
        { ...nomenclature, typeOfBase: 'main' },
        {
          where: { guid: nomenclature.guid }
        }))
    )

    return { message: "Номеклатура обновлена." }
  }


  /**
   * @param guid гуиды товаров, может быть несколько значений
   * @param contractGUID гуид торговой точки
   * @param baseType база, к которой идет обращение
   */
  async getAdditionalInfo(guid: string | string[], contractGUID: string, baseType: 'main' | 'additiona') {
    const urlMainBase = `${this.configService.get('URL_1C_MAIN')}/nomenclatures/currentData`;
    const urlAdditionalBase = `${this.configService.get('URL_1C_ADDITIONAL')}/nomenclatures/currentData`;
    const finishURL = baseType === 'main' ? urlMainBase : urlAdditionalBase;

    try {
      const response = await axios.post(finishURL, {
          productItems: guid,
          contractGUID: contractGUID
        },
        {
          headers: {
            Authorization: this.configService.get('TOKEN_1C')
          }
        })
      return response.data;
    } catch (e) {
      console.log(e)
      return new HttpException({ message: 'Не удалось подключиться к 1С для получения цен и остатков' }, HttpStatus.BAD_GATEWAY)
    }
  }

  // Добавим в класс или в отдельный файл утилит
  private fuzzySearch(query: string, text: string): boolean {
    if (!query || !text) return false;

    const cleanQuery = query.toLowerCase().trim();
    const cleanText = text.toLowerCase().trim();

    // Если запрос пустой или точное совпадение
    if (cleanQuery === '') return true;
    if (cleanText.includes(cleanQuery)) return true;

    // Нечеткий поиск с учетом опечаток
    return this.calculateSimilarity(cleanQuery, cleanText) > 0.7;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Простая реализация расстояния Левенштейна
    const len1 = str1.length;
    const len2 = str2.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    const distance = matrix[len1][len2];
    return 1 - distance / Math.max(len1, len2);
  }
}
