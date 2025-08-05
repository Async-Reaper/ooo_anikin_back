import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {TradePointService} from "./trade-point.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {CreateTradePointDto} from "./dto/create-trade-point.dto";
import {TradePoint} from "./trade-point.model";

@ApiTags('Торговая точка')
@Controller('trade-point')
export class TradePointController {
    constructor(private socialLinkService: TradePointService) {}

    @ApiOperation({summary: 'Добавление торговой точки'})
    @ApiResponse({status: 200, type: "Торговая точка добавлена"})
    @Post()
    add(@Body() dto: CreateTradePointDto, @Req() request: Request) {
        return this.socialLinkService.addTradePoint(request, dto);
    }

    @ApiOperation({summary: 'Удаление торговой точки'})
    @ApiResponse({status: 200, type: "Торговая точка удалена"})
    @Delete('/:id')
    delete(@Param('id') id: number, @Req() request: Request) {
        return this.socialLinkService.deleteTradePoint(id, request);
    }

    @ApiOperation({summary: 'Получение всех торговых точек'})
    @ApiResponse({status: 200, type: TradePoint})
    @Get()
    getAll() {
        return this.socialLinkService.getAllTradePoint();
    }

    @ApiOperation({summary: 'Получение торговой точки'})
    @ApiResponse({status: 200, type: TradePoint})
    @Get('/:id')
    getOne(@Param('id') id: number) {
        return this.socialLinkService.getTradePoint(id);
    }
}
