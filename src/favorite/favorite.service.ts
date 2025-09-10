import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../auth/dto/user.dto";
import { Favorite } from "./favorite.model";
import { GetNomenclaturesDto } from "../nomenclatures/dto/get-nomenclatures.dto";
import { GetBasketDto, GetBasketItemDto } from "../basket/dto/get-basket.dto";
import { NomenclaturesService } from "../nomenclatures/nomenclatures.service";
import { GetFavoriteDto } from "./dto/get-favorites.dto";
import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";


@Injectable()
export class FavoriteService {
  constructor(@InjectModel(Favorite) private favoriteRepository: typeof Favorite,
              private jwtService: JwtService,
              private nomenclatureService: NomenclaturesService) {
  }

  async create(dto: CreateFavoriteDto, request: Request) {
    const news = await this.favoriteRepository.create(dto)
    return news;
  }

  async getAll(
    response: Response,
    request: Request,
    page?: number,
    limit?: number,
    contractGuid?: string,
  ) {
    const token = request.headers['authorization'];
    const { userGUID }: UserDto = this.jwtService.decode(token);
    const favoritesCount = await this.favoriteRepository.count()
    const offset = page ? ((page - 1) * limit) : 0;

    const favorites = await this.favoriteRepository.findAll({ where: { userGUID }, limit: limit ? limit : favoritesCount, offset: offset, raw: true })

    response.header('X-Total-Count', favoritesCount.toString());
    response.header('Access-Control-Expose-Headers', 'X-Total-Count');

    const favoritesWithNomenclature = await Promise.all(
      favorites.map(async favorite => {
        try {
          const nomenclature: GetNomenclaturesDto = await this.nomenclatureService.getOne(request, favorite.productGUID, contractGuid);
          return {
            ...favorite,
            product: { ...nomenclature }
          }
        } catch (e) {
          return null;
        }
      })
    )
    // console.log('[Finish value]: ', favoritesWithNomenclature);
    return favoritesWithNomenclature;
  }

  async delete(id: number) {
    await this.favoriteRepository.destroy({ where: { id } })

    return { message: 'Избранный товар успешно удалено' }
  }
}
