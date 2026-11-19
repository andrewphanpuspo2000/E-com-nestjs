import { ApiProperty } from '@nestjs/swagger';

export class OrderApiResponseDto<T> {
  @ApiProperty({
    description: 'Indicates if the request was successfull',
  })
  success: boolean;

  @ApiProperty({
    description: 'Returned data',
    type: Object,
  })
  data: T;

  @ApiProperty({
    description: 'Optional message',
    nullable: true,
  })
  message: string;
}
