import { token } from './../utils/di';
import { DEFAULT_SCOPE, SECURITY_OPTIONS } from './../security.constants';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SecurityModuleOptions } from '../types/options';
import { SecurityJwtAuthenticator } from '../authenticators/jwt.authenticator';
import { Request } from 'express';
import { UserAuthenticatorInterface } from '../interfaces/authentication.interfaces';
import { SecuritySessionAuthenticator } from '../authenticators/auth_session.service';

export const dynamicStrategy = (
  scope: string = DEFAULT_SCOPE,
): { new (...args) } => {
  @Injectable()
  class DyamicStrategy extends PassportStrategy(
    Strategy,
    token('dynamic', scope),
  ) {
    constructor(
      @Inject(SECURITY_OPTIONS)
      private options: SecurityModuleOptions,
      private jwtAuthenticator: SecurityJwtAuthenticator,
      private sessionAuthenticator: SecuritySessionAuthenticator,
    ) {
      super();
    }

    get authenticator(): UserAuthenticatorInterface {
      return this.options.authenticator == 'jwt'
        ? this.jwtAuthenticator
        : this.options.authenticator == 'session'
        ? this.sessionAuthenticator
        : this.options.authenticator;
    }

    async authenticate(request: Request) {
      try {
        const payload = await this.authenticator.guard(request);
        this.success(payload);
      } catch (e) {
        this.fail(403);
      }
    }
  }

  return DyamicStrategy;
};
