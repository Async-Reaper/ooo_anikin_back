import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FavoriteService } from "./favorite.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { Favorite } from "./favorite.model";

@ApiTags('Избранные товары')
@Controller('favorites')
export class FavoriteController {
    constructor(private newsService: FavoriteService) {}

    @ApiOperation({summary: 'Создание избранного товара'})
    @ApiResponse({status: 200, type: Favorite})
    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() newsDto: CreateFavoriteDto, @Req() request: Request) {
        return this.newsService.create(newsDto, request);
    }

    @ApiOperation({summary: 'Получение всех избранных товаров'})
    @ApiResponse({status: 200, type: Favorite})
    @Get('')
    getAll(@Req() request: Request) {
        return this.newsService.getAll(request);
    }

    @ApiOperation({summary: 'Удаление избранных товаров'})
    @ApiResponse({status: 200, type: Favorite})
    @Delete('/:favoriteId')
    // @UseGuards(JwtAuthGuard)
    delete(@Param('favoriteId') id: number) {
        return this.newsService.delete(id);
    }
}
