import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@balkanworks/database";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { BusinessesModule } from "./modules/businesses/businesses.module";
import { LocationsModule } from "./modules/locations/locations.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { SearchModule } from "./modules/search/search.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { AdminModule } from "./modules/admin/admin.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { HealthModule } from "./modules/health/health.module";
import { AdminGuard, JwtAuthGuard } from "./common/security";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule, UsersModule, BusinessesModule, LocationsModule, NotificationsModule, SearchModule, ReviewsModule, AdminModule, FavoritesModule, HealthModule],
  providers: [JwtAuthGuard, AdminGuard],
})
export class AppModule {}
