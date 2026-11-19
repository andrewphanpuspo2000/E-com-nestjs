import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RoleGuard } from '../auth/guards/roles.guard.js';
import { OrdersService } from './orders.service.js';
import { ModerateThrottle } from '../../common/decorators/custom-throttler.decorator.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderApiResponseDto } from './dto/order-response.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  @ModerateThrottle()
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'Order created successfully',
    type: OrderApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data',
  })
  @ApiNotFoundResponse({
    description: 'Cart not found or empty',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many request - rate limit exceeded',
  })
  async create(
    @GetUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {}
}
