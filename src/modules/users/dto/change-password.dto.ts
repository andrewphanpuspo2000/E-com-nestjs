import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password for the user',
    example: 'NewP@assw0rd!',
  })
  @IsString()
  @IsNotEmpty({ message: 'New password must not be empty' })
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'NewP@ssw0rd!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password must not be empty' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, on number and one special character',
  })
  newPassword: string;
}
