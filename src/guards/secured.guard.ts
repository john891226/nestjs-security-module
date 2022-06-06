import { token } from '../utils/di';
import {
  DEFAULT_SCOPE,
  PUBLIC_ROUTE,
  SECURED_ROUTE_GUARD,
} from '../security.constants';
import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const secured = (scope: string) => token('dynamic', scope);

export const securedGuard = (
  scope: string = DEFAULT_SCOPE,
): { new (...args) } => {
  const securedId = secured(scope);

  @Injectable()
  class SecuredGuard extends AuthGuard(securedId) {
    constructor(private reflector: Reflector) {
      super();
    }

    canActivate(context: ExecutionContext) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isPublic) return true;

      const securedGuard = this.reflector.getAllAndOverride<string>(
        SECURED_ROUTE_GUARD,
        [context.getHandler(), context.getClass()],
      );

      if (securedGuard && securedGuard != securedId) return true;

      return super.canActivate(context);
    }
  }

  return SecuredGuard;
};
