import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FavoriteService } from "./favorite.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { Favorite } from "./favorite.model";
import { GetFavoriteDto } from "./dto/get-favorites.dto";
import { Response } from "express";

@ApiTags('Избранные товары')
@Controller('favorites')
export class FavoriteController {
    constructor(private favoritesService: FavoriteService) {}

    @ApiOperation({summary: 'Создание избранного товара'})
    @ApiResponse({status: 200, type: Favorite})
    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() favoritesDto: CreateFavoriteDto, @Req() request: Request) {
        return this.favoritesService.create(favoritesDto, request);
    }

    @ApiOperation({summary: 'Получение всех избранных товаров'})
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'tradePoint', required: false, type: String })
    @ApiResponse({status: 200, type: GetFavoriteDto})
    @Get('')
    getAll(
      @Res({ passthrough: true }) response: Response,
      @Req() request: Request,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('tradePoint') contractGuid?: string
    ) {
        return this.favoritesService.getAll(response, request, page, limit, contractGuid);
    }

    @ApiOperation({summary: 'Удаление избранных товаров'})
    @ApiResponse({status: 200, type: Favorite})
    @Delete('/:favoriteId')
    // @UseGuards(JwtAuthGuard)
    delete(@Param('favoriteId') id: number) {
        return this.favoritesService.delete(id);
    }
}
