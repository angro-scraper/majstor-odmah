import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { ApplyJobDto, CreateBookingDto, CreateJobDto, CreateMarketplaceItemDto, CreateProviderDto, CreateProviderServiceDto, CreateReportDto, CreateServiceRequestDto, MarketplaceService, SendMessageDto } from "./marketplace.service";

@Controller()
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Get("services/categories") categories() { return this.marketplace.categories().then((data) => ok(data)); }
  @Get("services") services(@Query("query") query?: string, @Query("category") category?: string, @Query("location") location?: string) { return this.marketplace.providers(query, category, location).then((data) => ok(data)); }
  @Get("services/providers/:id") provider(@Param("id") id: string) { return this.marketplace.provider(id).then((data) => ok(data)); }
  @Post("services/providers") @UseGuards(JwtAuthGuard) providerCreate(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateProviderDto) { return this.marketplace.createProvider(user.id, input).then((data) => ok(data, "Service provider profile created")); }
  @Post("services/providers/me/services") @UseGuards(JwtAuthGuard) providerService(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateProviderServiceDto) { return this.marketplace.createProviderService(user.id, input).then((data) => ok(data, "Service added")); }
  @Post("services/request") @UseGuards(JwtAuthGuard) request(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateServiceRequestDto) { return this.marketplace.createRequest(user.id, input).then((data) => ok(data, "Service request created")); }
  @Post("services/requests/:id/accept") @UseGuards(JwtAuthGuard) accept(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) { return this.marketplace.acceptRequest(user.id, id).then((data) => ok(data, "Service request accepted")); }
  @Post("services/book") @UseGuards(JwtAuthGuard) book(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateBookingDto) { return this.marketplace.book(user.id, input).then((data) => ok(data, "Booking created")); }

  @Get("jobs") jobs(@Query("category") category?: string, @Query("location") location?: string) { return this.marketplace.listJobs(category, location).then((data) => ok(data)); }
  @Get("jobs/:id") job(@Param("id") id: string) { return this.marketplace.job(id).then((data) => ok(data)); }
  @Post("jobs") @UseGuards(JwtAuthGuard) jobCreate(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateJobDto) { return this.marketplace.createJob(user.id, input).then((data) => ok(data, "Job published")); }
  @Post("jobs/:id/apply") @UseGuards(JwtAuthGuard) apply(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() input: ApplyJobDto) { return this.marketplace.apply(user.id, id, input).then((data) => ok(data, "Application submitted")); }

  @Get("marketplace") marketplaceItems(@Query("category") category?: string, @Query("location") location?: string) { return this.marketplace.marketplace(category, location).then((data) => ok(data)); }
  @Get("marketplace/items/:id") marketplaceItem(@Param("id") id: string) { return this.marketplace.marketplaceItem(id).then((data) => ok(data)); }
  @Post("marketplace/items") @UseGuards(JwtAuthGuard) marketplaceCreate(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateMarketplaceItemDto) { return this.marketplace.createMarketplaceItem(user.id, input).then((data) => ok(data, "Marketplace item published")); }
  @Post("marketplace/message") @UseGuards(JwtAuthGuard) message(@CurrentUser() user: AuthenticatedUser, @Body() input: SendMessageDto) { return this.marketplace.sendMessage(user.id, input).then((data) => ok(data, "Message sent")); }
  @Get("conversations") @UseGuards(JwtAuthGuard) conversations(@CurrentUser() user: AuthenticatedUser) { return this.marketplace.conversations(user.id).then((data) => ok(data)); }
  @Post("reports") @UseGuards(JwtAuthGuard) report(@CurrentUser() user: AuthenticatedUser, @Body() input: CreateReportDto) { return this.marketplace.report(user.id, input).then((data) => ok(data, "Report received")); }
}
