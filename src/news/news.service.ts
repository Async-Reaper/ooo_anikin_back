import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {News} from "./news.model";
import {CreateNewsDto} from "./dto/create-news.dto";
import {JwtService} from "@nestjs/jwt";


@Injectable()
export class NewsService {
    constructor(@InjectModel(News) private newsRepository: typeof News,
                private jwtService: JwtService) {}

    // async createPortfolio(dto: CreateNewsDto, request: Request) {
    //     const token = request.headers['authorization'];
    //
    //     if (this.jwtService.verify(token)) {
    //         const decodeToken: any = this.jwtService.decode(token);
    //         const userId: number = Number(decodeToken.id)
    //
    //         // if (userId == dto.userId) {
    //         //     const portfolio = await this.portfolioRepository.create(dto);
    //         //     await portfolio.save();
    //         //     return portfolio;
    //         // } else {
    //         //     throw new HttpException({message: 'Левый пользователь'}, HttpStatus.FORBIDDEN)
    //         // }
    //     }
    //
    // }
    //
    // async getAllPortAuthUser(request: Request) {
    //     const token = request.headers['authorization'];
    //
    //     if (this.jwtService.verify(token)) {
    //         const decodeToken: any = this.jwtService.decode(token);
    //         const userId: number = Number(decodeToken.id)
    //         const portfolio = await this.portfolioRepository.findAll({where: {userId}})
    //         return portfolio;
    //     }
    // }
    //
    // async getAllPortNoAuthUser(userId: number) {
    //     const portfolio = await this.portfolioRepository.findAll({where: {userId}})
    //     return portfolio;
    // }
    //
    // async getAll() {
    //     const portfolio = await this.portfolioRepository.findAll();
    //     return portfolio;
    // }
    //
    // async getOne(id: number) {
    //     const portfolio = await this.portfolioRepository.findOne({where: {id}})
    //     portfolio.count_view += 1;
    //     await portfolio.save();
    //     return portfolio;
    // }
    //
    // async updatePortfolio(id: number, dto: UpdatePortfolioDto, request: Request) {
    //
    //     const token = request.headers['authorization'];
    //
    //     if (this.jwtService.verify(token)) {
    //         const decodeToken: any = this.jwtService.decode(token);
    //         const userId: number = Number(decodeToken.id)
    //         const portfolio = await this.portfolioRepository.findOne({where: {id}})
    //
    //         if (userId == portfolio.userId) {
    //             await this.portfolioRepository.update(dto, {where: {id}});
    //             const newPortfolio = await this.portfolioRepository.findOne({where: {id}})
    //             return newPortfolio;
    //         } else {
    //             throw new HttpException({message: 'Левый пользователь'}, HttpStatus.FORBIDDEN)
    //         }
    //     } else {
    //         throw new HttpException({message: 'no such token'}, HttpStatus.FORBIDDEN)
    //     }
    // }
    //
    // async deletePortfolio(id: number) {
    //     await this.portfolioRepository.destroy({where: {id}})
    //
    //     return {message: 'Портфолио успешно удалено'}
    // }
}
