import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const req = ctx.req;

    // 1) Extract The Token From "Bearer <_Token_>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Please login to get access');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Please login to get access');
    }

    try {
      // 2) Verify and Decode the token
      const decodedToken = await this.jwtService.verifyToken(token);

      // 3) Get Logged User
      const loggedUser = await this.userService.findOneById(decodedToken.id);

      // 4) Attach the loggedUser to the request
      req.user = loggedUser;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Please login to get access');
    }
  }
}
