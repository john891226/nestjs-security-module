import { token } from './../utils/di';
import { DEFAULT_SCOPE } from './../security.constants';
import { SecurityModuleOptions } from './../types/options';
import { Inject, Injectable, Type } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { SECURITY_OPTIONS } from '../security.constants';
import { InjectSecurityAuthenticationService } from '../decorators/security.decorators';
import { SecurityAuthenticationService } from '../services/authentication.service';

export function localStrategy(scope: string = DEFAULT_SCOPE): {
  new (...args);
} {
  @Injectable()
  class LocalStrategy extends PassportStrategy(
    Strategy,
    token('local', scope),
  ) {
    constructor(
      @Inject(SECURITY_OPTIONS) private options: SecurityModuleOptions,
      @InjectSecurityAuthenticationService()
      private authService: SecurityAuthenticationService,
    ) {
      super();
    }

    async validate(username: string, password: string) {
      return await this.authService.validateUser(username, password);
    }
  }

  return LocalStrategy;
}
