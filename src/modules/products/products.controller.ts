import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RoleGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/enums.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductsService } from './products.service.js';
import { ProductResponseDto } from './dto/product-response.dto.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new product (Admin Only)',
  })
  @ApiBody({
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Sku already exist',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden- Admin role required',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create();
  }
}
