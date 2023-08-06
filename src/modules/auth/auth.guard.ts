import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { Authenticated } from './dto/authenticated-auth.dto copy';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwrService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: Authenticated = await this.jwrService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request.user = payload;
      console.log(request.user);
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] =
      request.headers.authorization?.split(' ') ?? undefined;

    return type === 'Bearer' ? token : undefined;
  }
}
