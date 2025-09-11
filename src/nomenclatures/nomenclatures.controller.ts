import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NomenclaturesService } from "./nomenclatures.service";
import { CreateNomenclaturesDto } from "./dto/create-nomenclatures.dto";
import { GetNomenclaturesDto } from "./dto/get-nomenclatures.dto";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JwtService } from "@nestjs/jwt";

@ApiTags('Товар')
@Controller('nomenclatures')
export class NomenclaturesController {
  constructor(private nomenclaturesService: NomenclaturesService) {
  }

  @ApiOperation({ summary: 'Создание номеклатуры' })
  @ApiResponse({ status: 200, type: CreateNomenclaturesDto })
  // @UseInterceptors(FileInterceptor('img'))
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateNomenclaturesDto) {
    return this.nomenclaturesService.create(dto)
  }

  @ApiOperation({ summary: 'Получение всех номеклатур' })
  @ApiResponse({ status: 200, type: GetNomenclaturesDto })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'isDiscount', required: false, type: Boolean })
  @ApiQuery({ name: 'isNew', required: false, type: Boolean })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'tradePoint', required: false, type: String })
  @ApiQuery({ name: 'brands', required: false, type: Array })
  @ApiQuery({ name: 'group', required: false, type: String })
  @ApiQuery({ name: 'searchValue', required: false, type: String })
  @Get()
  @UseGuards(JwtAuthGuard)
  @Header('Access-Control-Expose-Headers', 'X-Total-Count')
  getAll(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('tradePoint') tradePoint?: string,
    @Query('brands') brands?: string[],
    @Query('group') group?: string,
    @Query('isDiscount') isDiscount?: boolean,
    @Query('isNew') isNew?: boolean,
    @Query('inStock') inStock?: boolean,
    @Query('searchValue') searchValue?: string,
  ) {
    return this.nomenclaturesService.getAll(request, response, page, limit, tradePoint, brands, group, isDiscount, isNew, inStock, searchValue);
  }

  @ApiOperation({ summary: 'Получение похожих товаров' })
  @ApiResponse({ status: 200, type: GetNomenclaturesDto })
  @ApiQuery({ name: 'productGUID', required: true, type: String })
  @ApiQuery({ name: 'group', required: true, type: String })
  @ApiQuery({ name: 'tradePoint', required: false, type: String })
  @Get('/similar')
  @UseGuards(JwtAuthGuard)
  getSimilar(
    @Req() request: Request,
    @Query('productGUID') productGUID: string,
    @Query('group') groupGUID: string,
    @Query('tradePoint') contractGuid?: string,
  ) {
    return this.nomenclaturesService.getSimilar(request, productGUID, groupGUID, contractGuid);
  }

  @ApiOperation({ summary: 'Получение номенклатуры по id' })
  @ApiResponse({ status: 200, type: GetNomenclaturesDto })
  @ApiQuery({ name: 'guid', required: true, type: String })
  @ApiQuery({ name: 'contractGuid', required: false, type: String })
  @Get('/byId')
  @UseGuards(JwtAuthGuard)
  getOne(
    @Req() request: Request,
    @Query('guid') guid: string,
    @Query('contractGuid') contractGuid?: string,
  ) {
    return this.nomenclaturesService.getOne(request, guid, contractGuid);
  }

  @ApiOperation({ summary: 'Удаление номенклатуры' })
  @ApiResponse({ status: 200, type: GetNomenclaturesDto })
  @Delete('/:guid')
  delete(@Param('guid') guid: string) {
    return this.nomenclaturesService.delete(guid);
  }
}
