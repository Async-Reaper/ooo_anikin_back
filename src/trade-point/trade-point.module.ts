import {forwardRef, Module} from '@nestjs/common';
import {TradePointService} from './trade-point.service';
import {TradePointController} from './trade-point.controller';
import {AuthModule} from "../auth/auth.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {TradePoint} from "./trade-point.model";

@Module({
  providers: [TradePointService],
  controllers: [TradePointController],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([TradePoint]),
  ]
})
export class TradePointModule {}
