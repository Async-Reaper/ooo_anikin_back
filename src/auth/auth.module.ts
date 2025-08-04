import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      // forwardRef(() => ''),
      JwtModule.register({})
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
