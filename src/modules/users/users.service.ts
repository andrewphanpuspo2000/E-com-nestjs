import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly SALT_ROUND = 10;

  constructor(private prisma: PrismaService) {}

  async findOne(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailTaken) throw new NotFoundException('Email is already taken');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    return updatedUser;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const isPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isPassword)
      throw new NotFoundException('Current Password is incorrect');

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword)
      throw new NotFoundException(
        'New password must be different from the current password',
      );

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUND);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Password has been updated successfully' };
  }

  async remove(userId: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account has been deleted' };
  }
}
