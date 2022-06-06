import { securedGuard } from './guards/secured.guard';
import { localGuard } from './guards/local.guard';
import { JwtModule } from '@nestjs/jwt';
import { SecurityJwtAuthenticator } from './authenticators/jwt.authenticator';
import { Module, DynamicModule, Provider, Type } from '@nestjs/common';
import { DEFAULT_SCOPE, SECURITY_OPTIONS } from './security.constants';
import { SecurityAuthenticationService } from './services/authentication.service';
import { SecurityUsersService } from './services/users.service';
import {
  AsyncSecurityModuleOptions,
  SecurityModuleOptions,
} from './types/options';
import { getProvider, token } from './utils/di';
import { localStrategy } from './strategies/local.strategy';
import { dynamicStrategy } from './strategies/dynamic.strategy';
import { SecuritySessionAuthenticator } from './authenticators/auth_session.service';

function getExports(name: string = DEFAULT_SCOPE): Provider[] {
  return [
    getProvider(SecurityUsersService, name),
    getProvider(SecurityAuthenticationService, name),
  ];
}

const dynamicProviders = (name: string) => [
  {
    provide: token('local-strategy', name),
    useClass: localStrategy(name),
  },
  {
    provide: token('local-guard', name),
    useClass: localGuard(name),
  },
  {
    provide: token('dynamic-strategy', name),
    useClass: dynamicStrategy(name),
  },
  {
    provide: token('secured-guard', name),
    useClass: securedGuard(name),
  },
];

@Module({})
export class SecurityModule {
  static register(
    { global = true, ...options }: SecurityModuleOptions,
    name: string = DEFAULT_SCOPE,
  ): DynamicModule {
    const exports = getExports(name);

    const providers = [
      {
        provide: SECURITY_OPTIONS,
        useValue: options,
      },
      SecurityJwtAuthenticator,
      SecuritySessionAuthenticator,
      ...exports,
      ...dynamicProviders(name),
    ];

    return {
      global,
      imports: [JwtModule.register({})],
      module: SecurityModule,
      providers,
      exports,
      controllers: [],
    };
  }

  static registerAsync(
    { global = true, useFactory, inject, imports }: AsyncSecurityModuleOptions,
    name: string = DEFAULT_SCOPE,
  ): DynamicModule {
    const exports = getExports(name);
    const providers = [
      {
        provide: SECURITY_OPTIONS,
        inject,
        useFactory,
      },
      ...dynamicProviders(name),
      SecurityJwtAuthenticator,
      SecuritySessionAuthenticator,
      ...exports,
    ];

    return {
      global,
      module: SecurityModule,
      imports: [JwtModule.register({}), ...(imports ?? [])],
      providers,
      exports,
      controllers: [],
    };
  }
}
