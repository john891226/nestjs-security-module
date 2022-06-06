import { SessionAuthenticatorOptions } from './../types/options';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { SECURITY_OPTIONS } from '../security.constants';
import { UserAuthenticatorInterface } from '../interfaces/authentication.interfaces';
import { User, UserPayload } from '../types/user.types';
import { Request } from 'express';

@Injectable()
export class SecuritySessionAuthenticator<
  P extends UserPayload = UserPayload,
  U extends User = User,
> implements UserAuthenticatorInterface<P, U>
{
  constructor(
    @Inject(SECURITY_OPTIONS)
    private options: SessionAuthenticatorOptions,
  ) {}

  async signin(payload: P, user: U, request: Request): Promise<void> {
    const session = request.session;
    (session as any).user = payload;
  }
  async signout(payload: P, user: U, request: Request): Promise<void> {
    await new Promise((resolve) => {
      request.session.destroy(() => {
        resolve(1);
      });
    });
  }

  async guard(request: Request): Promise<P> {
    const session = request.session;

    if (!(session as any).user) {
      throw new ForbiddenException();
    }

    return (session as any).user;
  }
}
