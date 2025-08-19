import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { GetFileDto } from "./dto/get-file.dto";

@ApiTags('Картинки')
@Controller('pictures')
export class FilesController {

  constructor(private filesService: FilesService) {
  }

  @Post('create')
  @ApiOperation({ summary: 'Создание изображения' })
  @ApiResponse({ status: 200, type: GetFileDto })
  add(@Body() pictureDto: CreateFileDto) {
    return this.filesService.addImage(pictureDto)
  }
}