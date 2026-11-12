import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CategoryResponseDto {
  @ApiProperty({
    example: '550e2332-127634te231-3782732',
    description: 'The unique identified of category',
  })
  id: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the category',
  })
  name: string;

  @ApiProperty({
    example: 'Devices and gadgets including phones, laptops, and accessories',
    description: 'A bried description of the category',
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    example: 'electronics',
    description: 'The URL-friendly slug for the category',
    required: false,
    maxLength: 100,
  })
  slug: string | null;

  @ApiProperty({
    example: 'https://example.com/images/electronics.png',
    description: 'URL of the category image',
    nullable: true,
  })
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Incidicates if the category is active',
  })
  isActive: boolean;

  @ApiProperty({
    example: 150,
    description: 'Number of products in this category',
  })
  productCount: number;

  @ApiProperty({
    description: 'Category creation date',
    example: '2023-10-01T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Category updated date',
    example: '2023-10-01T12:34:56.789Z',
  })
  updatedAt: Date;
}
