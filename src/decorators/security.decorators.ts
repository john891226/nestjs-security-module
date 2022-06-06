import { secured, securedGuard } from './../guards/secured.guard';
import {
  createParamDecorator,
  Inject,
  ExecutionContext,
  UseGuards,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import {
  DEFAULT_SCOPE,
  PUBLIC_ROUTE,
  SECURED_ROUTE_GUARD,
} from '../security.constants';
import { token } from '../utils/di';
import { SecurityUsersService } from '../services/users.service';
import { SecurityAuthenticationService } from '../services/authentication.service';
import { localGuard } from '../guards/local.guard';

export const InjectSecurityUserService = (name: string = DEFAULT_SCOPE) =>
  Inject(token(SecurityUsersService, name));

export const InjectSecurityAuthenticationService = (
  name: string = DEFAULT_SCOPE,
) => Inject(token(SecurityAuthenticationService, name));

export const ReqUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return data ? req?.user?.[data] : req.user;
});

export const UseSignInGuard = (scope: string = DEFAULT_SCOPE) =>
  applyDecorators(Public(), UseGuards(localGuard(scope)));

export const UseSecureGuard = (scope: string = DEFAULT_SCOPE) =>
  applyDecorators(
    SetMetadata(SECURED_ROUTE_GUARD, secured(scope)),
    UseGuards(securedGuard(scope)),
  );

export const Public = () => SetMetadata(PUBLIC_ROUTE, true);
