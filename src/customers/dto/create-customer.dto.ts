import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsNotEmpty } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateCustomerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome do Cliente.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do Cliente.' })
  @IsEmail({}, { message: 'O email informado deve ser válido.' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o telefone do Cliente.' })
  @IsMobilePhone(
    'pt-BR',
    { strictMode: false },
    {
      message: 'O telefone informado deve ser válido.',
    },
  )
  phone: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o CPF do Cliente.' })
  @IsCPF({ message: 'O CPF informado deve ser válido.' })
  cpf: string;
}
