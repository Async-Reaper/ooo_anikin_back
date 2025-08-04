import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {BrandService} from "./brand.service";
import {BrandController} from "./brand.controller";
import {Brand} from "./brand.model";
import {Nomenclatures} from "../nomenclatures/nomenclatures.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    providers: [BrandService],
    controllers: [BrandController],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([Brand]),
    ]
})
export class BrandModule {}
