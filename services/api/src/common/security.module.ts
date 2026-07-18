import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "@balkanworks/database";
import { AdminGuard, JwtAuthGuard } from "./security";

@Global()
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [JwtAuthGuard, AdminGuard],
  exports: [JwtModule, JwtAuthGuard, AdminGuard],
})
export class SecurityModule {}
