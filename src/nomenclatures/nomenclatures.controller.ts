import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post, Query, Req,
    UploadedFile,
    UseGuards,
    UseInterceptors, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {NomenclaturesService} from "./nomenclatures.service";
import { CreateNomenclaturesDto } from "./dto/create-nomenclatures.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import { GetNomenclaturesDto } from "./dto/get-nomenclatures.dto";

@ApiTags('Товар')
@Controller('nomenclatures')
export class NomenclaturesController {
    constructor(private nomenclaturesService: NomenclaturesService) {}

    @ApiOperation({summary: 'Создание номеклатуры'})
    @ApiResponse({status: 200, type: CreateNomenclaturesDto})
    // @UseInterceptors(FileInterceptor('img'))
    @Post()
    create(@Body() dto: CreateNomenclaturesDto) {
        return this.nomenclaturesService.create(dto)
    }

    @ApiOperation({summary: 'Получение всех номеклатур'})
    @ApiResponse({status: 200, type: GetNomenclaturesDto})
    @ApiQuery({ name: 'page', required: true, type: Number })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    @ApiQuery({ name: 'isDiscount', required: false, type: Boolean })
    @ApiQuery({ name: 'isNew', required: false, type: Boolean })
    @ApiQuery({ name: 'inStock', required: false, type: Boolean })
    @ApiQuery({ name: 'tradePoint', required: false, type: String })
    @ApiQuery({ name: 'brands', required: false, type: Array })
    @ApiQuery({ name: 'group', required: false, type: String })
    @Get()
    getAll(
      @Query('page') page: number,
      @Query('limit') limit: number,
      @Query('tradePoint') tradePoint?: string,  // Если это query-параметр
      @Query('brands') brands?: string[],        // Массив можно передать как ?brands=brand1,brand2
      @Query('group') group?: string,
      @Query('isDiscount') isDiscount?: boolean,
      @Query('isNew') isNew?: boolean,
      @Query('inStock') inStock?: boolean,
    ) {
        return this.nomenclaturesService.getAll(page, limit, tradePoint, brands, group, isDiscount, isNew, inStock);
    }

    @ApiOperation({summary: 'Получение номенклатуры по id'})
    @ApiResponse({status: 200, type: GetNomenclaturesDto})
    @Get('/:guid')
    getOne(@Param('guid') guid: string, @Req() request: Request) {
        return this.nomenclaturesService.getOne(guid, request);
    }
}
