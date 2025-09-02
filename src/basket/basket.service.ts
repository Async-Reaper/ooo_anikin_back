import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Basket, BasketItem } from "./basket.model";
import { CreateBasketDto, CreateBasketItemDto } from "./dto/create-basket.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../auth/dto/user.dto";
import { UpdateBasketDto, UpdateBasketItemDto } from "./dto/update-basket.dto";
import { NomenclaturesService } from "../nomenclatures/nomenclatures.service";
import { GetBasketDto, GetBasketItemDto } from "./dto/get-basket.dto";
import { GetNomenclaturesDto } from "../nomenclatures/dto/get-nomenclatures.dto";
import { CreateOrderDto } from "./dto/create-order.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private basketRepository: typeof Basket,
    @InjectModel(BasketItem) private basketItemRepository: typeof BasketItem,
    private nomenclatureService: NomenclaturesService,
    private jwtService: JwtService,
    private configService: ConfigService) {
  }

  async createBasket(basketDto: CreateBasketDto, request: Request) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);

    try {
      const basket = await this.basketRepository.create({
        userGUID: userGUID,
        address: basketDto.address,
        tradePointGUID: basketDto.tradePointGUID,
        items: []
      })
      return basket;
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async updateBasket(id: number, updateBasketDto: UpdateBasketDto) {
    try {
      await this.basketRepository.update({ ...updateBasketDto }, { where: { id } });

      return { message: "Данные корзины обновлены" }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async getAll(tradePointGUID: string, request: Request) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);

    try {
      const basket = await this.basketRepository.findOne({ where: { userGUID, tradePointGUID }, raw: true });

      if (!basket) {
        throw new HttpException({ message: "Корзины не обнаружено" }, HttpStatus.BAD_REQUEST)
      }
      const basketItems = await this.basketItemRepository.findAll({ where: { basketId: basket.id }, raw: true })

      // Добавление полной информации о номеклатуре
      const productsWithPrices = await Promise.all(
        basketItems.map(async (item) => {
          try {
            const nomenclature: GetNomenclaturesDto = await this.nomenclatureService.getOne(item.nomenclatureGUID, tradePointGUID, request);
            if (!nomenclature) {
              console.warn(`Товар ${item.nomenclatureGUID} не найден`);
              return null;
            }

            return {
              ...nomenclature,
              id: item.id,
              basketId: basket.id,
              count: item.count,
            };
          } catch (error) {
            console.error(`Ошибка загрузки товара ${item.nomenclatureGUID}:`, error.message);
            return null;
          }
        })
      ) as GetBasketItemDto[];

      // Возврат пустого значения, в случае если товар с передаваемым guid не найден
      const validProducts = productsWithPrices.filter(product => product !== null);

      return ({
        ...basket,
        items: [...validProducts]
      }) as GetBasketDto;

    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async getOne(basketId: number, nomenclatureGUID: string, request: Request) {
    const nomenclature = await this.basketItemRepository.findOne({ where: { basketId, nomenclatureGUID } });
    return nomenclature;
  }

  async deleteBasket(id: number) {
    try {
      const basket = await this.basketRepository.destroy({ where: { id } })

      if (!basket) {
        return new HttpException("Корзина не найдена", HttpStatus.BAD_REQUEST, undefined)
      }

      await this.basketItemRepository.destroy({ where: { basketId: basket } });

      return { message: "Корзина удалена" }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async clearBasket(id: number) {
    try {
      const basket = await this.basketRepository.findOne({ where: { id } })
      if (!basket) {
        return new HttpException("Корзина не найдена", HttpStatus.BAD_REQUEST, undefined)
      }

      const basketProducts = await this.basketItemRepository.findAll({ where: { basketId: id } })

      if (basketProducts.length === 0) {
        return new HttpException("Товаров не обнаружено", HttpStatus.BAD_REQUEST, undefined)
      }

      await this.basketItemRepository.destroy({ where: { basketId: basket.id } });

      return { message: "Корзина очищена" }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async addProductToBasket(tradePointGUID: number, request: Request, basketDto: CreateBasketItemDto) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);

    try {
      const basket = await this.basketRepository.findOne({ where: { tradePointGUID, userGUID, } })

      if (!basket) {
        return new HttpException("Корзина не найдена", HttpStatus.BAD_REQUEST, undefined)
      }

      await this.basketItemRepository.create({ ...basketDto, basketId: basket.id })
      return { message: "Товар добавлен" }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async updateBasketItem(basketId: number, nomenclatureGUID: string, updateBasketItemDto: UpdateBasketItemDto) {

    try {
      if (updateBasketItemDto.count === 0) {
        await this.basketItemRepository.destroy({ where: { basketId, nomenclatureGUID } })
        return new HttpException({ message: "Товар удален" }, HttpStatus.OK)
      } else {
        await this.basketItemRepository.update({ ...updateBasketItemDto }, { where: { basketId, nomenclatureGUID } });
      }

      return { message: "Данные товара обновлены" }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async deleteProductBasket(id: number) {
    try {
      const basketProduct = await this.basketItemRepository.findOne({ where: { id } })

      if (!basketProduct) {
        return new HttpException("Товара не обнаружено", HttpStatus.BAD_REQUEST, undefined)
      }

      await this.basketItemRepository.destroy({ where: { id } });

      return { message: "Товар удален из корзины" }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }

  async createOrder(dto: CreateOrderDto) {
    try {
      const basket = await this.basketRepository.findOne({ where: { id: dto.basketId }, raw: true })

      if (!basket) {
        return new HttpException("Корзина не найдена", HttpStatus.BAD_REQUEST, undefined)
      }

      // if (basket) {
      //   await this.basketItemRepository.destroy({ where: { basketId: dto.basketId } })
      // }
      const responseFetchOrder = await this.fetchDataOrder(dto);

      return { message: "Заказ успешно оформлен. Ожидайте утверждения." }
    } catch (e) {
      throw new HttpException({ message: "Произошла ошибка", details: e.message }, HttpStatus.BAD_REQUEST)
    }
  }


  private async fetchDataOrder(dto: CreateOrderDto) {
    const data = {
      header: { ...dto.header },
      products: [...dto.products]
    }
    console.log(data)
    try {
      const response = await axios.post('http://192.168.1.95/ut_test_copy/hs/api_v2/docs/orders/build', data,
        {
          headers: {
            Authorization: this.configService.get('TOKEN_1C')
          }
        })
      return response.data;
    } catch (e) {
      console.log(e.message)
      throw new HttpException({ message: "Произошла ошибка c 1C", details: e.response.data }, HttpStatus.BAD_REQUEST)
    }
  }
}
