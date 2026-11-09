import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'abc@gmail.com',
  })
  @IsEmail({}, { message: 'Provide valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password!234',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
