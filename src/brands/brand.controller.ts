import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BrandService } from "./brand.service";
import { Brand } from "./brand.model";
import { CreateBrandDto } from "./dto/create-brand.dto";


@ApiTags('Бренды')
@Controller('brands')
export class BrandController {
    constructor(private brandService: BrandService) {}

    @ApiOperation({summary: 'Создание группы'})
    @ApiResponse({status: 200, type: "Группа успешно создана"})
    @Post()
    create(@Body() groupDto: CreateBrandDto, @Req() request: Request) {
        return this.brandService.create(groupDto, request);
    }

    @ApiOperation({summary: 'Удаление группы'})
    @ApiResponse({status: 200, type: "Группа успешно удалена"})
    @Delete('/:id')
    delete(@Param('id') id: number) {
        return this.brandService.delete(id);
    }

    @ApiOperation({summary: 'Получение всех групп'})
    @ApiResponse({status: 200, type: Brand})
    @Get()
    getAll() {
        return this.brandService.getAll();
    }

    @ApiOperation({summary: 'Получение группы по id'})
    @ApiResponse({status: 200, type: Brand})
    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.brandService.getOne(id);
    }
}
