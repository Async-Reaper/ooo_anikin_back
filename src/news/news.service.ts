import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { News } from "./news.model";
import { CreateNewsDto } from "./dto/create-news.dto";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../auth/dto/user.dto";
import { UpdateNewsDto } from "./dto/update-news.dto";


@Injectable()
export class NewsService {
  constructor(@InjectModel(News) private newsRepository: typeof News,
              private jwtService: JwtService) {
  }

  async create(dto: CreateNewsDto, request: Request) {
    const token = request.headers['authorization'];

    // if (this.jwtService.verify(token)) {
    // const { role }: UserDto = this.jwtService.decode(token);

    // if (role === "admin") {
    const news = await this.newsRepository.create(dto)
    return news;
    //     }
    // }
  }

  async getAllForUser(request: Request) {
    const token = request.headers['authorization'];

    // if (this.jwtService.verify(token)) {
    const { userGUID }: UserDto = this.jwtService.decode(token);
    const news = await this.newsRepository.findAll({ where: { userGUID } })
    return news;
    // }
  }

  async getAll() {
    const news = await this.newsRepository.findAll({where: {userGUID: ''}})
    return news;
  }

  async update(newsId: number, dto: UpdateNewsDto, request: Request) {
    const token = request.headers['authorization'];

    // if (this.jwtService.verify(token)) {
    // const { role }: UserDto = this.jwtService.decode(token);

    // if (role === "admin") {
    const news = await this.newsRepository.update(dto, { where: { id: newsId } })
    return news;
    //     }
    // }
  }

  async delete(id: number) {
    await this.newsRepository.destroy({ where: { id } })

    return { message: 'Новость успешно удалено' }
  }
}
