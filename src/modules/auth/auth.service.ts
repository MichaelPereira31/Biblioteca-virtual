import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { encrypted } from 'src/shared/util/encrypted';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async authentication(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findByEmail(loginAuthDto.email);

    if (!user)
      throw new NotFoundException(`User ${loginAuthDto.email} not found`);

    const iv = user.password.split('-');
    const encryptedPassword = await encrypted(loginAuthDto.password, iv[0]);

    if (encryptedPassword !== user.password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, name: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
