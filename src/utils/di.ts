import { Provider, Type } from '@nestjs/common';
import { UserAuthenticatorInterface } from '../interfaces/authentication.interfaces';
import { DEFAULT_SCOPE } from '../security.constants';

export const token = <T>(
  cls: Type<T> | string,
  scope: string = DEFAULT_SCOPE,
): string => `${scope}-${typeof cls == 'string' ? cls : cls.name}`;

export function getProvider<T>(
  cls: Type<T>,
  scope: string = DEFAULT_SCOPE,
  val?: any,
): Provider {
  return {
    provide: token(cls, scope),
    useClass: cls,
  };
}
