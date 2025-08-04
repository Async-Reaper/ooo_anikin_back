import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Group} from "./groups.model";
import {CreateGroupsDto} from "./dto/create-groups.dto";
import {JwtService} from "@nestjs/jwt";


@Injectable()
export class GroupsService {
    constructor(@InjectModel(Group) private groupRepository: typeof Group,
                private jwtService: JwtService) {}

    async createGroup(dto: CreateGroupsDto, request: Request) {
        const token = request.headers['authorization'];

        const group = await this.groupRepository.create(dto);
        throw new HttpException({message: "group created"}, HttpStatus.OK);
        // if (this.jwtService.verify(token)) {
        //     const decodeToken: any = this.jwtService.decode(token);
        //     const userId: number = Number(decodeToken.id)
        //
        //     // if (userId == dto.userId) {
        //     //     const portfolio = await this.portfolioRepository.create(dto);
        //     //     await portfolio.save();
        //     //     return portfolio;
        //     // } else {
        //     //     throw new HttpException({message: 'Левый пользователь'}, HttpStatus.FORBIDDEN)
        //     // }
        // }

    }
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
