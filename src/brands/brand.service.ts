import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Brand } from "./brand.model";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class BrandService {
    constructor(@InjectModel(Brand) private brandRepository: typeof Brand,
                private jwtService: JwtService) {}

    async create(dto: CreateBrandDto, request: Request) {
        const token = request.headers['authorization'];

        const brand = await this.brandRepository.findOne({where: {guid: dto.guid}});

        if (!brand) {
            await this.brandRepository.create(dto);
        } else {
            await this.brandRepository.update(dto, {where: {guid: dto.guid}})
        }
        throw new HttpException({message: "Бренд успешно создан"}, HttpStatus.OK);
    }

    async getAll() {
        const brand = await this.brandRepository.findAll();
        return brand;
    }

    async getOne(id: number) {
        const brand = await this.brandRepository.findOne({where: {id}})
        if (!brand) {
            throw new HttpException({message: `Бренда с id=${id} не найдено`}, HttpStatus.BAD_REQUEST)
        }
        return brand;
    }

    async delete(id: number) {
        const brand = await this.brandRepository.findOne({where: {id}})

        if (!brand) {
            throw new HttpException({message: `Бренда с id=${id} не найдено`}, HttpStatus.BAD_REQUEST)
        } else {
            await this.brandRepository.destroy({where: {id}})
        }

        throw new HttpException({message: `Бренд успешно удален`}, HttpStatus.OK)
    }
}
