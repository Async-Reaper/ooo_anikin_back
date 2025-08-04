import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { NomenclaturesService } from "./nomenclatures.service";
import { NomenclaturesController } from "./nomenclatures.controller";
import { Brand } from "../brands/brand.model";
import { Nomenclatures } from "./nomenclatures.model";
import { FilesModule } from "../files/files.module";
import { AuthModule } from "../auth/auth.module";
import { Group } from "../groups/groups.model";
import { GroupsModule } from "../groups/groups.module";
import { BrandModule } from "../brands/brand.module";

@Module({
  providers: [NomenclaturesService],
  controllers: [NomenclaturesController],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => BrandModule),
    SequelizeModule.forFeature([Nomenclatures, Brand, Group]),
    FilesModule
  ],
  exports: [
    NomenclaturesService
  ]
})

export class NomenclaturesModule {
}

