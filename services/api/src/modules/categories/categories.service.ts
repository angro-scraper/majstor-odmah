import { Injectable } from "@nestjs/common";
import { CategoryType } from "@prisma/client";
import { PrismaService } from "@balkanworks/database";
import { IsEnum, IsOptional } from "class-validator";

export class ListCategoriesDto {
  @IsOptional() @IsEnum(CategoryType) type?: CategoryType;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: ListCategoriesDto) {
    return this.prisma.category.findMany({
      where: { deletedAt: null, ...(input.type ? { type: input.type } : {}) },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }
}
