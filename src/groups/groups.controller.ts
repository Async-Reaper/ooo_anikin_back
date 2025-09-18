import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GroupsService } from "./groups.service";
import { CreateGroupsDto } from "./dto/create-groups.dto";
import { Group } from "./groups.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";


@ApiTags('Группы товаров')
@Controller('groups')
export class GroupsController {
    constructor(private groupService: GroupsService) {}

    @ApiOperation({summary: 'Создание группы'})
    @ApiResponse({status: 200, type: "Группа успешно создана"})
    @Post()
    create(@Body() groupDto: CreateGroupsDto, @Req() request: Request) {
        return this.groupService.create(groupDto, request);
    }

    @ApiOperation({summary: 'Удаление группы'})
    @ApiResponse({status: 200, type: "Группа успешно удалена"})
    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: number) {
        return this.groupService.delete(id);
    }

    @ApiOperation({summary: 'Получение всех групп'})
    @ApiResponse({status: 200, type: Group})
    @Get()
    // @UseGuards(JwtAuthGuard)
    getAll(@Req() request: Request) {
        return this.groupService.getAll(request);
    }

    @ApiOperation({summary: 'Получение группы по id'})
    @ApiResponse({status: 200, type: Group})
    @Get('/:id')
    @UseGuards(JwtAuthGuard)
    getOne(@Param('id') id: number, @Req() request: Request) {
        return this.groupService.getOne(id, request);
    }
}
