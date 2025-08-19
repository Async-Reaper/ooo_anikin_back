import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Files } from "./files.model";
import { FilesController } from "./files.controller";

@Module({
  providers: [FilesService],
  imports: [
    SequelizeModule.forFeature([Files])
  ],
  controllers: [FilesController],
  exports: [FilesService]
})
export class FilesModule {}
