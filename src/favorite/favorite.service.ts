import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../auth/dto/user.dto";
import { Favorite } from "./favorite.model";


@Injectable()
export class FavoriteService {
  constructor(@InjectModel(Favorite) private favoriteRepository: typeof Favorite,
              private jwtService: JwtService) {
  }

  async create(dto: CreateFavoriteDto, request: Request) {
    const token = request.headers['authorization'];

    // if (this.jwtService.verify(token)) {
    // const { role }: UserDto = this.jwtService.decode(token);

    const news = await this.favoriteRepository.create(dto)
    return news;
    // }
  }

  async getAll(request: Request) {
    const token = request.headers['authorization'];

    if (this.jwtService.verify(token)) {
      const { userGUID }: UserDto = this.jwtService.decode(token);

      const news = await this.favoriteRepository.findAll({where: {userGUID}})
      return news;
    }
  }

  async delete(id: number) {
    await this.favoriteRepository.destroy({ where: { id } })

    return { message: 'Избранный товар успешно удалено' }
  }
}
