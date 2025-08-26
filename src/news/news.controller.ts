import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { NewsService } from "./news.service";
import { CreateNewsDto } from "./dto/create-news.dto";
import { News } from "./news.model";
import { UpdateNewsDto } from "./dto/update-news.dto";

@ApiTags('Новости')
@Controller('news')
export class NewsController {
    constructor(private newsService: NewsService) {}

    @ApiOperation({summary: 'Создание новости'})
    @ApiResponse({status: 200, type: News})
    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() newsDto: CreateNewsDto, @Req() request: Request) {
        return this.newsService.create(newsDto, request);
    }

    @ApiOperation({summary: 'Редактирование новости'})
    @ApiResponse({status: 200, type: News})
    @Put('/:newsId')
    // @UseGuards(JwtAuthGuard)
    update(@Param('newsId') newsId: number, @Body() newsDto: UpdateNewsDto, @Req() request: Request) {
        return this.newsService.update(newsId, newsDto, request);
    }

    @ApiOperation({summary: 'Получение всех новостей для конкретного пользователя'})
    @ApiResponse({status: 200, type: News})
    @Get('/for-current')
    // @UseGuards(JwtAuthGuard)
    getAllForUser(@Req() request: Request) {
        return this.newsService.getAllForUser(request);
    }

    @ApiOperation({summary: 'Получение всех новостей'})
    @ApiResponse({status: 200, type: News})
    @Get('')
    getAll() {
        return this.newsService.getAll();
    }

    @ApiOperation({summary: 'Удаление новости'})
    @ApiResponse({status: 200, type: News})
    @Delete('/:newsId')
    // @UseGuards(JwtAuthGuard)
    delete(@Param('newsId') id: number) {
        return this.newsService.delete(id);
    }
}
