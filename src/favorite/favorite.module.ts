import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";
import { AuthModule } from "../auth/auth.module";
import { Favorite } from "./favorite.model";
import { NomenclaturesModule } from "../nomenclatures/nomenclatures.module";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";

@Module({
    providers: [FavoriteService],
    controllers: [FavoriteController],
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => NomenclaturesModule),
        SequelizeModule.forFeature([Favorite, Nomenclatures]),
    ]
})
export class FavoriteModule {}
