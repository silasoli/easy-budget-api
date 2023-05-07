import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dto/user-login.dto';
import { AuthService } from '../services/auth.service';
import { Ilogin } from '../interfaces/Ilogin.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'User login endpoint.' })
  @Post('/users')
  async login(@Body() loginDto: UserLoginDto): Promise<Ilogin> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) throw new ForbiddenException('Credenciais inválidas');

    return this.authService.login({ ...user });
  }
}
