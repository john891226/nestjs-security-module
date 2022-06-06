import { ExtractJwt } from 'passport-jwt';
import { JwtAuthenticatorOptions } from './../types/options';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ApiResponseProperty } from '@nestjs/swagger';
import { UserPayload, User } from '../types/user.types';
import { UserAuthenticatorInterface } from '../interfaces/authentication.interfaces';
import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SECURITY_OPTIONS } from '../security.constants';
import ms from 'ms';
import m from 'moment';
import { hotp, authenticator, totp } from 'otplib';
import { Request, Response } from 'express';

export class SignInResponseDTO {
  @ApiResponseProperty()
  access_token: string;
  @ApiResponseProperty()
  refresh_token: string;
  @ApiResponseProperty()
  expires_in: number;
}

const cookieExtractor = (req): string =>
  req && req.cookies && req.cookies.Authorization
    ? req.cookies.Authorization
    : null;

const extractor = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  cookieExtractor,
]);

@Injectable()
export class SecurityJwtAuthenticator<
  P extends UserPayload = UserPayload,
  U extends User = User,
> implements UserAuthenticatorInterface<P, U>
{
  readonly signOptions: JwtSignOptions;

  constructor(
    @Inject(SECURITY_OPTIONS)
    private options: JwtAuthenticatorOptions,
    private jwtService: JwtService,
  ) {}

  async signin(
    payload: P,
    user: U,
    request: Request,
  ): Promise<SignInResponseDTO> {
    const expiresIn = this.options.signOptions.expiresIn ?? '4h';

    const access_token = await this.jwtService.sign(
      { ...payload },
      {
        ...(this.options.signOptions ?? {}),
        expiresIn,
        secret: this.options.secret,
      },
    );

    return {
      access_token,
      refresh_token: await this.jwtService.sign(
        {
          access_token,
        },
        {
          secret: this.options.secret,
        },
      ),
      expires_in: m()
        .add(
          typeof expiresIn == 'number' ? expiresIn * 1000 : ms(expiresIn),
          'milliseconds',
        )
        .toDate()
        .getTime(),
    };
  }
  signout(payload: P, user: U, request: Request): Promise<void> {
    return;
  }

  async guard(request: Request): Promise<P> {
    const token = extractor(request);
    if (!token) {
      throw new ForbiddenException();
    }

    const valid = await this.jwtService.verify(token, {
      secret: this.options.secret,
      ignoreExpiration: false,
    });

    return valid;
  }
}
