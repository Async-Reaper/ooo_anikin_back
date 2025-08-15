import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { BasketService } from "./basket.service";
import { BasketController } from "./basket.controller";
import { Basket, BasketItem } from "./basket.model";
import { AuthModule } from "../auth/auth.module";
import { NomenclaturesModule } from "../nomenclatures/nomenclatures.module";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";
import { NomenclaturesService } from "../nomenclatures/nomenclatures.service";

@Module({
    providers: [BasketService, NomenclaturesService],
    controllers: [BasketController],
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => NomenclaturesModule),
        SequelizeModule.forFeature([Basket, BasketItem, Nomenclatures])
    ],
})
export class BasketModule {}
