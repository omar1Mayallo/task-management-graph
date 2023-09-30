import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRoles } from 'src/shared/constants/user-roles';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
      gqlContext.getHandler(),
      gqlContext.getClass()
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = gqlContext.getContext();
    const { user } = ctx.req;

    if (!user) {
      throw new UnauthorizedException('You must be authenticated to access this resource');
    }

    const isAuthorized = requiredRoles.includes(user.role);

    if (!isAuthorized) {
      throw new UnauthorizedException('You do not have permission to perform this action');
    }

    return true;
  }
}
