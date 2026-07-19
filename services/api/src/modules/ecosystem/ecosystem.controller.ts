import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { SuperAppModuleKey } from "@prisma/client";
import { ok } from "../../common/api-response";
import { AuthenticatedUser, CurrentUser, JwtAuthGuard } from "../../common/security";
import { EcosystemService } from "./ecosystem.service";

class PreferenceDto {
  @IsEnum(SuperAppModuleKey) module!: SuperAppModuleKey;
  @IsOptional() @IsBoolean() enabled?: boolean;
  @IsOptional() @IsNumber() score?: number;
}
class PreferencesDto { @IsArray() @ValidateNested({ each: true }) @Type(() => PreferenceDto) preferences!: PreferenceDto[]; }
class HealthProfileDto { @IsOptional() @IsString() @MaxLength(8) bloodType?: string; @IsOptional() @IsArray() @IsString({ each: true }) allergies?: string[]; @IsOptional() @IsString() @MaxLength(2000) notes?: string; }
class HealthReminderDto { @IsString() @MaxLength(160) title!: string; @Type(() => Date) @IsDate() reminderAt!: Date; }
class VehicleDto { @IsString() @MaxLength(80) make!: string; @IsString() @MaxLength(80) model!: string; @IsOptional() year?: number; @IsOptional() @IsString() @MaxLength(32) registration?: string; }
class GroupDto { @IsString() @MaxLength(120) name!: string; @IsOptional() @IsString() @MaxLength(1200) description?: string; @IsOptional() @IsUUID() cityId?: string; }
class JoinGroupDto { @IsUUID() groupId!: string; }

@Controller("ecosystem")
export class EcosystemController {
  constructor(private readonly ecosystem: EcosystemService) {}

  @Get("modules") modules() { return ok(this.ecosystem.modules()); }
  @Get("events") events(@Query("cityId") cityId?: string) { return this.ecosystem.events(cityId).then((data) => ok(data)); }
  @Get("travel/experiences") experiences(@Query("cityId") cityId?: string) { return this.ecosystem.experiences(cityId).then((data) => ok(data)); }
  @Get("real-estate/listings") listings(@Query("cityId") cityId?: string) { return this.ecosystem.listings(cityId).then((data) => ok(data)); }
  @Get("education/courses") courses(@Query("category") category?: string) { return this.ecosystem.courses(category).then((data) => ok(data)); }
  @Get("community/groups") groups(@Query("cityId") cityId?: string) { return this.ecosystem.groups(cityId).then((data) => ok(data)); }

  @Get("home") @UseGuards(JwtAuthGuard) home(@CurrentUser() user: AuthenticatedUser) { return this.ecosystem.home(user.id).then((data) => ok(data)); }
  @Put("preferences") @UseGuards(JwtAuthGuard) preferences(@CurrentUser() user: AuthenticatedUser, @Body() input: PreferencesDto) { return this.ecosystem.updatePreferences(user.id, input.preferences).then((data) => ok(data)); }
  @Get("balkan-card") @UseGuards(JwtAuthGuard) card(@CurrentUser() user: AuthenticatedUser) { return this.ecosystem.membershipCard(user.id).then((data) => ok(data)); }
  @Get("health/profile") @UseGuards(JwtAuthGuard) healthProfile(@CurrentUser() user: AuthenticatedUser) { return this.ecosystem.healthProfile(user.id).then((data) => ok(data)); }
  @Put("health/profile") @UseGuards(JwtAuthGuard) saveHealth(@CurrentUser() user: AuthenticatedUser, @Body() input: HealthProfileDto) { return this.ecosystem.saveHealthProfile(user.id, input).then((data) => ok(data)); }
  @Post("health/reminders") @UseGuards(JwtAuthGuard) healthReminder(@CurrentUser() user: AuthenticatedUser, @Body() input: HealthReminderDto) { return this.ecosystem.addHealthReminder(user.id, input).then((data) => ok(data)); }
  @Get("auto/vehicles") @UseGuards(JwtAuthGuard) vehicles(@CurrentUser() user: AuthenticatedUser) { return this.ecosystem.vehicles(user.id).then((data) => ok(data)); }
  @Post("auto/vehicles") @UseGuards(JwtAuthGuard) vehicle(@CurrentUser() user: AuthenticatedUser, @Body() input: VehicleDto) { return this.ecosystem.addVehicle(user.id, input).then((data) => ok(data)); }
  @Post("community/groups") @UseGuards(JwtAuthGuard) createGroup(@CurrentUser() user: AuthenticatedUser, @Body() input: GroupDto) { return this.ecosystem.createGroup(user.id, input).then((data) => ok(data)); }
  @Post("community/groups/join") @UseGuards(JwtAuthGuard) joinGroup(@CurrentUser() user: AuthenticatedUser, @Body() input: JoinGroupDto) { return this.ecosystem.joinGroup(user.id, input.groupId).then((data) => ok(data)); }
}
