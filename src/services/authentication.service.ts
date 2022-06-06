import { SecurityJwtAuthenticator } from '../authenticators/jwt.authenticator';
import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { valid } from '../utils/hcrypt';
import {
  UserValidatorInterface,
  UserAuthenticatorInterface,
} from '../interfaces/authentication.interfaces';
import { SECURITY_OPTIONS } from '../security.constants';
import { UserPayload as Payload, User } from '../types/user.types';
import { SecurityModuleOptions } from '../types/options';
import { Request, Response } from 'express';
import { SecuritySessionAuthenticator } from '../authenticators/auth_session.service';

@Injectable()
export class SecurityAuthenticationService<T extends Payload = Payload>
  implements UserValidatorInterface<T>
{
  constructor(
    @Inject(SECURITY_OPTIONS)
    private options: SecurityModuleOptions,
    private jwtAuthenticator: SecurityJwtAuthenticator,
    private sessionAuthenticator: SecuritySessionAuthenticator,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{
    payload: T;
    user;
  }> {
    const user = await this.options.userResolver.getUser(username, false);

    if (!user) throw new UnauthorizedException();

    const isValid = await valid(password, user.password);

    if (!isValid) throw new UnauthorizedException();

    const payload = await this.options.userResolver.getUserPayload(
      username,
      false,
    );

    return {
      payload: payload as T,
      user,
    };
  }

  get authenticator(): UserAuthenticatorInterface {
    return this.options.authenticator == 'jwt'
      ? this.jwtAuthenticator
      : this.options.authenticator == 'session'
      ? this.sessionAuthenticator
      : this.options.authenticator;
  }

  async signin(payload, user, request: Request) {
    return await this.authenticator.signin(payload, user, request);
  }

  async signout(payload, request: Request) {
    const user = await this.options.userResolver.getUser(
      payload.username,
      false,
    );
    return await this.authenticator.signout(payload, user, request);
  }
}
