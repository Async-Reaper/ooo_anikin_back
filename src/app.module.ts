import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path';
import { AuthModule } from "./auth/auth.module";
import { BrandModule } from './brands/brand.module';
import { Brand } from "./brands/brand.model";
import { NomenclaturesModule } from "./nomenclatures/nomenclatures.module";
import { Nomenclatures } from "./nomenclatures/nomenclatures.model";
import { TradePointModule } from './trade-point/trade-point.module';
import { TradePoint } from "./trade-point/trade-point.model";
import { GroupsModule } from "./groups/groups.module";
import { Group } from "./groups/groups.model";
import { NewsModule } from "./news/news.module";
import { News } from "./news/news.model";
import { Basket, BasketItem } from "./basket/basket.model";
import { BasketModule } from "./basket/basket.module";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Brand, Group, News, Nomenclatures, TradePoint, Basket, BasketItem],
      autoLoadModels: true
    }),
    TradePointModule,
    FilesModule,
    AuthModule,
    BrandModule,
    GroupsModule,
    TradePointModule,
    NomenclaturesModule,
    NewsModule,
    BasketModule
  ]
})
export class AppModule {
}
