import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {BrandService} from "./brand.service";
import {CreateBrandDto} from "./dto/create-brand.dto";
import {Brand} from "./brand.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";


@ApiTags('Бренды')
@Controller('brands')
export class BrandController {
    constructor(private brandService: BrandService) {}

    @ApiOperation({summary: 'Создание бренда'})
    @ApiResponse({status: 200, type: Brand})
    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() brandDto: CreateBrandDto, @Req() request: Request) {
        return this.brandService.createPortfolio(brandDto, request);
    }
    //
    // @ApiOperation({summary: 'Редактирование портфолио'})
    // @ApiResponse({status: 200, type: Portfolio})
    // @Put('/:portfolioId')
    // @UseGuards(JwtAuthGuard)
    // update(@Param('portfolioId') id: number, @Body() portfolio: UpdatePortfolioDto, @Req() request: Request) {
    //     return this.portfolioService.updatePortfolio(id, portfolio, request);
    // }
    //
    // @ApiOperation({summary: 'Удаление портфолио'})
    // @ApiResponse({status: 200, type: Portfolio})
    // @Delete('/:portfolioId')
    // @UseGuards(JwtAuthGuard)
    // delete(@Param('portfolioId') id: number) {
    //     return this.portfolioService.deletePortfolio(id);
    // }
    //
    //
    // @ApiOperation({summary: 'Получение всех портфолио для авторизованного пользователя'})
    // @ApiResponse({status: 200, type: Portfolio})
    // @Get('/user')
    // getAllAuthPortUser(@Req() request: Request) {
    //     return this.portfolioService.getAllPortAuthUser(request);
    // }
    //
    // @ApiOperation({summary: 'Получение всех портфолио для неавторизованного пользователя'})
    // @ApiResponse({status: 200, type: Portfolio})
    // @Get('/:portfolioId')
    // getAllPortNoAuthUser(@Param('portfolioId') id: number) {
    //     return this.portfolioService.getAllPortNoAuthUser(id);
    // }
    //
    // @ApiOperation({summary: 'Получение всех портфолио'})
    // @ApiResponse({status: 200, type: Portfolio})
    // @Get('')
    // getAll() {
    //     return this.portfolioService.getAll();
    // }
    //
    // @ApiOperation({summary: 'Получение портфолио по id'})
    // @ApiResponse({status: 200, type: Portfolio})
    // @Get('brands/:portfolioId')
    // getOne(@Param('portfolioId') id: number) {
    //     return this.portfolioService.getOne(id);
    // }
}
