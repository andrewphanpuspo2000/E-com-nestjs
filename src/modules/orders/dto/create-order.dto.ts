import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 49.99,
  })
  @IsNumber(
    {
      maxDecimalPlaces: 22,
    },
    {
      message: 'Price must be a valid number (e.g., 49.99)',
    },
  )
  @Type(() => Number)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [OrderItemDto],
  })
  @IsArray()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shippingAddress: string;
}
