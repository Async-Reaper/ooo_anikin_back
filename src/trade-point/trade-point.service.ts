import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TradePoint} from "./trade-point.model";
import {JwtService} from "@nestjs/jwt";
import { CreateTradePointDto } from "./dto/create-trade-point.dto";
import { UserDto } from "../auth/dto/user.dto";

@Injectable()
export class TradePointService {

    constructor(@InjectModel(TradePoint) private tradePointRepository: typeof TradePoint,
                private jwtService: JwtService) {
    }

    async get(id: number) {
        const tradePoint = await this.tradePointRepository.findOne({where: {id}});
        if (!tradePoint) {
            throw new HttpException({message: `Торговой точки с id=${id} не найдено`}, HttpStatus.BAD_REQUEST)
        }
        return tradePoint
    }

    async getAll(request: Request) {
        const token = request.headers['authorization'];
        const { userGUID }: UserDto = this.jwtService.decode(token);
        // const tradePoint = await this.tradePointRepository.findAll({where: {counterpartyGuid: userGUID}});
        const tradePoint = await this.tradePointRepository.findAll();
        return tradePoint
    }

    async create(request, dto: CreateTradePointDto) {
        const tradePoint = await this.tradePointRepository.findOne({where: { guid: dto.guid }})
        if (!tradePoint) {
            await this.tradePointRepository.create(dto);
        } else {
            await this.tradePointRepository.update(dto, {where: {guid: dto.guid}})
        }
        throw new HttpException({ message: "Торговая точка успешно создана" }, HttpStatus.OK)
    }

    async delete(id: number, request: Request) {
        const token = request.headers['authorization'];
        const tradePoint = await this.tradePointRepository.findOne({where: {id}})

        if (!tradePoint) {
            throw new HttpException({message: `Торговой точки с id=${id} не найдено`}, HttpStatus.BAD_REQUEST)
        }

        await this.tradePointRepository.destroy({where: {id}});
    }
}
