import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { FavoriteService } from "./favorite.service";
import { FavoriteController } from "./favorite.controller";
import { AuthModule } from "../auth/auth.module";
import { Favorite } from "./favorite.model";

@Module({
    providers: [FavoriteService],
    controllers: [FavoriteController],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([Favorite]),
    ]
})
export class FavoriteModule {}
