import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {NomenclaturesService} from "./nomenclatures.service";
import {CreateNomenclaturesDto} from "./dto/create-nomenclatures.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@ApiTags('Товар')
@Controller('nomenclatures')
export class NomenclaturesController {
    constructor(private contentPortfolioService: NomenclaturesService) {}

    @ApiOperation({summary: 'Создание номеклатуры'})
    @ApiResponse({status: 200, type: CreateNomenclaturesDto})
    @UseInterceptors(FileInterceptor('img'))
    @Post()
    create(@Body() dto: CreateNomenclaturesDto) {
        return this.contentPortfolioService.create(dto)
    }
    //
    // @ApiOperation({summary: 'Получение номенклатуры по id'})
    // @ApiResponse({status: 200, type: CreateNomenclaturesDto})
    // @Get('/:id')
    // getOne(@Param('id') id: number) {
    //     return this.contentPortfolioService.getOne(id);
    // }
    //
    // @ApiOperation({summary: 'Получение всего контента портфолио по id портфолио'})
    // @ApiResponse({status: 200, type: CreateNomenclaturesDto})
    // @Get('/nomenclatures')
    // getAll(@Param('portfolioId') id: number) {
    //     return this.contentPortfolioService.getAll(id);
    // }
    //
    // @ApiOperation({summary: 'Удаление контента портфолио'})
    // @ApiResponse({status: 200, type: null})
    // @UseGuards(JwtAuthGuard)
    // @Delete('/:id')
    // delete(@Param('id') id: number) {
    //     return this.contentPortfolioService.delete(id);
    // }
}
