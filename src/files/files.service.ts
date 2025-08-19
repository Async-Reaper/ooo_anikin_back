import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { CreateFileDto } from "./dto/create-file.dto";
import { dirname } from 'node:path';

@Injectable()
export class FilesService {

  async addImage(dto: CreateFileDto) {
    const path = `static/${dto.picture_category}/${dto.guid_object}/${dto.guid_object}.${dto.picture_type}`
    const file = await this.createFile(dto.binary_image, path);
    return file;
  }

  /**
   * @param base64String - изображение в формате base:64
   * @param outputPath - итоговый путь к изображению
   * @return Promise<void>
   */

  async createFile(base64String, outputPath) {
    try {
      // Удаляем префикс (если есть)
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

      // Создаем буфер из Base64
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const dir = dirname(outputPath);

      await fs.promises.mkdir(dir, { recursive: true })

      // Записываем файл
      await fs.promises.writeFile(`${outputPath}`, imageBuffer);

      console.log(`Изображение успешно сохранено: ${outputPath}`);
    } catch (error) {
      console.error('Ошибка при сохранении изображения:', error);
      throw error;
    }
  }

}
