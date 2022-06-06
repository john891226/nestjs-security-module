import { UserAuthenticatorInterface } from '../interfaces/authentication.interfaces';
import {
  CreateUserInterface,
  UpdateUserInterface,
  UserResolverInterface,
} from '../interfaces/users.interfaces';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

type AsyncOption<T> = (...args: any[]) => T | Promise<T>;

interface CommonModuleOptions {
  global?: boolean;
}

export type CustomAuthenticatorOptions = {
  authenticator: UserAuthenticatorInterface;
};

export type SessionAuthenticatorOptions = {
  authenticator: 'session';
};

export type JwtAuthenticatorOptions = {
  authenticator: 'jwt';
  secret: string;
  signOptions: JwtSignOptions;
  verifyOptions: JwtVerifyOptions;
};

export type SecurityModuleOptions = {
  userCreator?: CreateUserInterface;
  userResolver: UserResolverInterface;
  userUpdater?: UpdateUserInterface;
} & CommonModuleOptions &
  (
    | JwtAuthenticatorOptions
    | CustomAuthenticatorOptions
    | SessionAuthenticatorOptions
  );

export interface AsyncSecurityModuleOptions extends CommonModuleOptions {
  inject?: any[];
  imports?: any[];
  useFactory: AsyncOption<SecurityModuleOptions>;
}
