import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module.js';
import { CategoryModule } from './modules/category/category.module.js';
import { ProductsModule } from './modules/products/products.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    CategoryModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
