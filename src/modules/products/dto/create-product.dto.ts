import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Headphone',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-quality wireless headphone with noise cancellation',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'stock keeping Unit (Sku) unique identifier',
    example: 'WH-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @ApiProperty({
    description: 'Product image url',
    example: 'https://example.com/image.png',
  })
  @IsString()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
    required: true,
  })
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty({
    description: 'Whether product is active and available for purchase',
    example: true,
    default: true,
    required: true,
  })
  @IsBoolean()
  isActive: boolean;
}
