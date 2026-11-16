import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { Category, Prisma, Product } from '../../generated/prisma/client.js';
import { QueryProductDto } from './dto/query-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const existingSku = await this.prisma.product.findUnique({
      where: {
        sku: createProductDto.sku,
      },
    });

    if (!existingSku) {
      throw new ConflictException(
        `Product with sku ${createProductDto.sku} already exist`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: new Prisma.Decimal(createProductDto.price),
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(product);
  }

  private formatProduct(
    product: Product & { category: Category },
  ): ProductResponseDto {
    return {
      ...product,
      price: Number(product.price),
      category: product.category.name,
    };
  }

  async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  }> {
    const { category, isActive, search, page = 1, limit = 1 } = queryDto;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          description: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return {
      data: products.map((product) => this.formatProduct(product)),
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}
