import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "@balkanworks/database";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ReferralsModule } from "../referrals/referrals.module";

@Module({
  imports: [
    DatabaseModule, ReferralsModule,
    JwtModule.register({
      // AuthService supplies an explicit short-lived access-token secret at signing time.
      // This default keeps other injected JwtService uses aligned with the shared env setup.
      secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
