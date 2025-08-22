import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BasketService } from "./basket.service";
import { CreateBasketDto, CreateBasketItemDto } from "./dto/create-basket.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateBasketDto, UpdateBasketItemDto } from "./dto/update-basket.dto";
import { GetBasketDto } from "./dto/get-basket.dto";


@ApiTags('Корзина')
@Controller('basket')
export class BasketController {
    constructor(private basketService: BasketService) {}

    @ApiOperation({summary: 'Создание корзины'})
    @ApiResponse({status: 200, type: "Товар добавлен"})
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() basketDto: CreateBasketDto, @Req() request: Request) {
        return this.basketService.createBasket(basketDto,  request);
    }

    @ApiOperation({summary: 'Получение данных корзины'})
    @ApiResponse({status: 200, type: GetBasketDto})
    @ApiQuery({ name: 'tradePointGUID', required: true, type: String })
    @Get()
    @UseGuards(JwtAuthGuard)
    getAll(
      @Query('tradePointGUID') tradePointGUID: string,
      @Req() request: Request
    ) {
        return this.basketService.getAll(tradePointGUID, request);
    }

    @ApiOperation({summary: 'Редактирование информации о корзине'})
    @ApiResponse({status: 200, type: CreateBasketDto})
    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    update(@Param("id") id: number, @Body() updateBasketDto: UpdateBasketDto) {
        return this.basketService.updateBasket(id, updateBasketDto);
    }

    @ApiOperation({summary: 'Удаление корзины'})
    @ApiResponse({status: 200, type: CreateBasketDto})
    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    delete(
      @Param("id") id: number,
    ) {
        return this.basketService.deleteBasket(id);
    }

    @ApiOperation({summary: 'Добавление товара в корзину'})
    @ApiResponse({status: 200, type: "Товар добавлен"})
    @Post('/:tradePointGUID/product')
    @UseGuards(JwtAuthGuard)
    addToBasket(
      @Param('tradePointGUID') basketId: number,
      @Req() request: Request,
      @Body() basketDto: CreateBasketItemDto
    ) {
        return this.basketService.addProductToBasket(basketId, request, basketDto);
    }

    //добработать для того, чтобы можно было редактировать из вне с указанием корзины
    @ApiOperation({summary: 'Редактирование товара в корзине'})
    @ApiResponse({status: 200, type: CreateBasketDto})
    @Put(':basketId/product/:nomenclatureGUID')
    @UseGuards(JwtAuthGuard)
    updateProduct(
      @Param('basketId') basketId: number,
      @Param('nomenclatureGUID') nomenclatureGUID: string,
      @Body() updateBasketItemDto: UpdateBasketItemDto
    ) {
        return this.basketService.updateBasketItem(basketId, nomenclatureGUID, updateBasketItemDto);
    }

    @ApiOperation({summary: 'Удаление всех товаров из корзины'})
    @ApiResponse({status: 200, type: CreateBasketDto})
    @Delete('/:basketId/products')
    @UseGuards(JwtAuthGuard)
    clearBasket(
      @Param("basketId") basketId: number,
    ) {
        return this.basketService.clearBasket(basketId);
    }

    @ApiOperation({summary: 'Удаление одного товара из корзины'})
    @ApiResponse({status: 200, type: CreateBasketDto})
    @Delete('/products/:productId')
    @UseGuards(JwtAuthGuard)
    deleteProduct(
      @Param('productId') productId: number,
    ) {
        return this.basketService.deleteProductBasket(productId);
    }

    @ApiOperation({summary: 'Оформление заказа'})
    @ApiResponse({status: 200, type: CreateBasketDto})
    @ApiQuery({ name: 'basketId', required: true, type: Number })
    @Post('/order')
    // @UseGuards(JwtAuthGuard)
    createOrder(
      @Query('basketId') basketId: number,
    ) {
        return this.basketService.createOrder(basketId);
    }
}
