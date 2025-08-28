import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { NewsService } from "./news.service";
import { NewsController } from "./news.controller";
import { News } from "./news.model";
import { AuthModule } from "../auth/auth.module";

@Module({
    providers: [NewsService],
    controllers: [NewsController],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([News]),
    ]
})
export class NewsModule {}
