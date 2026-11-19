import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { Category, Prisma, Product } from '../../generated/prisma/client.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

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

    if (existingSku) {
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

  async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPage: number;
    };
  }> {
    const { categoryId, isActive, search, page = 1, limit = 1 } = queryDto;

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
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

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.formatProduct(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) throw new NotFoundException('Product not found');

    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (skuTaken)
        throw new ConflictException(
          `Product with sku ${updateProductDto.sku} already exists`,
        );
    }
    const updatedData: any = { ...updateProductDto };

    if (updateProductDto.price !== undefined) {
      updatedData.price = new Prisma.Decimal(updateProductDto.price);
    }
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updatedData,
      include: {
        category: true,
      },
    });

    return this.formatProduct(updatedProduct);
  }

  async updateStock(id: string, quantity: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: {
        category: true,
      },
    });

    return this.formatProduct(updateProduct);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        cartItems: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete product that is part of existing orders. Consider marking it as inactive only',
      );
    }

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return { message: 'Product deleted successfully' };
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
}
