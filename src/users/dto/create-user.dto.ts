import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Field "name" must be specified!',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Field "email" must be specified!',
  })
  @IsEmail({})
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Field "password" must be specified!',
  })
  password: string;
}
