import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@balkanworks/database";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { BusinessesModule } from "./modules/businesses/businesses.module";
import { LocationsModule } from "./modules/locations/locations.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule, UsersModule, BusinessesModule, LocationsModule, NotificationsModule],
})
export class AppModule {}
