import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TradePoint} from "./trade-point.model";
import {JwtService} from "@nestjs/jwt";
import { CreateTradePointDto } from "./dto/create-trade-point.dto";

@Injectable()
export class TradePointService {

    constructor(@InjectModel(TradePoint) private tradePointRepository: typeof TradePoint,
                private jwtService: JwtService) {
    }

    async getTradePoint(id: number) {
        const tradePoint = await this.tradePointRepository.findOne({where: {id}});
        if (!tradePoint) {
            throw new HttpException({message: `Торговой точки с id=${id} не найдено`}, HttpStatus.BAD_REQUEST)
        }
        return tradePoint
    }

    async getAllTradePoint() {
        const tradePoint = await this.tradePointRepository.findAll();
        return tradePoint
    }

    async addTradePoint(request, dto: CreateTradePointDto) {
        const tradePoint = await this.tradePointRepository.findOne({where: { guid: dto.guid }})
        if (!tradePoint) {
            await this.tradePointRepository.create(dto);
        } else {
            await this.tradePointRepository.update(dto, {where: {guid: dto.guid}})
        }
        await tradePoint.save();
        return tradePoint;
    }

    async deleteTradePoint(id: number, request: Request) {
        const token = request.headers['authorization'];
        const tradePoint = await this.tradePointRepository.findOne({where: {id}})

        if (!tradePoint) {
            throw new HttpException({message: `Торговой точки с id=${id} не найдено`}, HttpStatus.BAD_REQUEST)
        }

        await this.tradePointRepository.destroy({where: {id}});
    }
}
