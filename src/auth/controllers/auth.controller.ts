import { Controller, Post, Body, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../dto/user-login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'User login endpoint.' })
  @Post('/auth')
  async login(@Body() loginDto: UserLoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) throw new ForbiddenException('Invalid credentials');

    return this.authService.login({ ...user });
  }
}
