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
import { AiModule } from "./modules/ai/ai.module";
import { OffersModule } from "./modules/offers/offers.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { OperationsModule } from "./modules/operations/operations.module";
import { PartnersModule } from "./modules/partners/partners.module";
import { ComplianceModule } from "./modules/compliance/compliance.module";
import { FeaturesModule } from "./modules/features/features.module";
import { FlyersModule } from "./modules/flyers/flyers.module";
import { SaveFoodModule } from "./modules/save-food/save-food.module";
import { SupportModule } from "./modules/support/support.module";
import { DealsModule } from "./modules/deals/deals.module";
import { SecurityModule } from "./common/security.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, SecurityModule, AuthModule, UsersModule, BusinessesModule, CategoriesModule, LocationsModule, NotificationsModule, SearchModule, ReviewsModule, AdminModule, FavoritesModule, HealthModule, AiModule, OffersModule, DealsModule, AnalyticsModule, OperationsModule, PartnersModule, ComplianceModule, FeaturesModule, FlyersModule, SaveFoodModule, SupportModule],
})
export class AppModule {}
