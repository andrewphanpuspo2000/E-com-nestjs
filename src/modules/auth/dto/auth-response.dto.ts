//DTO for auth response to frontend

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma/enums.js';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJsbdabdiabdskjbadkbskjbakbdsjabdk',
  })
  accessToken: string;
  @ApiProperty({
    description: 'Refresh token for authentication',
    example: 'Gdsbsabdjhbadb!dmadhkabdsba;',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Authenticated user information',
    example: {
      id: 'user123',
      email: '<EMAIL>',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
