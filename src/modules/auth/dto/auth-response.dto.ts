//DTO for auth response to frontend

import { Role } from '../../../generated/prisma/enums.js';

export class AuthResponseDto {
  accessToken: string;

  refreshToken: string;

  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
