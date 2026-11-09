import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma/enums.js';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123432e435-yewugwe-123dew-1378327483274',
  })
  id: string;

  @ApiProperty({ description: 'User email address', example: 'abc@gmail.com' })
  email: string;

  @ApiProperty({ description: 'User firstname', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'User lastname', example: 'Doe' })
  lastName: string;

  @ApiProperty({ description: 'Role', enum: Role })
  role: Role;

  @ApiProperty({
    description: 'Account creation date',
    example: '2023-10-01T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last account update date',
    example: '2023-10-01T12:34:56.789Z',
  })
  updatedAt: Date;
}
