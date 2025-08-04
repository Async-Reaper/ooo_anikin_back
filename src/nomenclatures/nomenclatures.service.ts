import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {CreateNomenclaturesDto} from "./dto/create-nomenclatures.dto";
import {Nomenclatures} from "./nomenclatures.model";
import {FilesService} from "../files/files.service";

@Injectable()
export class NomenclaturesService {
    constructor(@InjectModel(Nomenclatures)
                private nomenclaturesRepository: typeof Nomenclatures) {}

    async create(dto: CreateNomenclaturesDto) {
        // const fileName = await this.fileService.createFile(dto.img);
        const nomenclature = await this.nomenclaturesRepository.create(dto);
        return nomenclature;
    }

    async getAll(portfolioId: number) {
        // const contentPortfolo = await this.contentPortfolioRepository.findAll({where: {portfolioId}});
        // return contentPortfolo;

        /*
        1) запрос в 1с - получение гуидов товаров
        2) перебор базы по соответствию гуидов
        3) выдача результата
         */
    }
    //
    // async getOne(id: number) {
    //     const contentPortfolo = await this.contentPortfolioRepository.findOne({where: {id}})
    //     return contentPortfolo;
    // }
    //
    // async delete(id: number) {
    //     await this.contentPortfolioRepository.destroy({where: {id}})
    //     return {message: 'Элемент портфолио успешно удален'}
    // }
}
