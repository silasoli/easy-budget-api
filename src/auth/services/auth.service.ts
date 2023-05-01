import { Injectable } from '@nestjs/common';
import { UserLoginDto } from '../dto/user-login.dto';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/schemas/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: UserLoginDto): Promise<User> {
    const user = await this.usersService.findByEmail(login.email);

    if (!user) return null;

    const passMatch = await this.usersService.comparePass(
      login.password,
      user.password,
    );

    if (!passMatch) return null;

    return user;
  }

  async login(user: any) {
    const { _id, name, email } = user;
    const payload = { name, sub: _id };
    return {
      id: _id,
      email,
      name,
      access_token: this.jwtService.sign(payload),
    };
  }

  async decodeAccessToken(accessToken: string) {
    const response = await this.jwtService.verifyAsync(accessToken);

    return response;
  }
}
