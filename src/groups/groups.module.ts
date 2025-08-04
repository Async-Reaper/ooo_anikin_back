import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {GroupsService} from "./groups.service";
import {GroupsController} from "./groups.controller";
import {Group} from "./groups.model";
import {AuthModule} from "../auth/auth.module";
import { Nomenclatures } from "../nomenclatures/nomenclatures.model";

@Module({
    providers: [GroupsService],
    controllers: [GroupsController],
    imports: [
        forwardRef(() => AuthModule),
        SequelizeModule.forFeature([Group]),
    ],
})
export class GroupsModule {}
