import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: '54376273-734876dw324-2374631764dbs',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Headphone',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High quality wireless headphones',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Product price',
    example: 99.99,
  })
  price: number;
  @ApiProperty({
    description: 'Product stock',
    example: 100,
  })
  stock: number;

  @ApiProperty({
    description: 'Stock Keeping Unit',
    example: 'WH-100',
  })
  sku: string;

  @ApiProperty({
    description: 'Product image url',
    example: 'https://example.com/image.png',
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Product category',
    example: 'Electronics',
  })
  category: string | null;

  @ApiProperty({
    description: 'Product availability status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
