import { token } from './../utils/di';
import { DEFAULT_SCOPE } from './../security.constants';
import { AuthGuard } from '@nestjs/passport';

const local = (scope: string) => token('local', scope);

export const localGuard = (scope: string = DEFAULT_SCOPE) =>
  AuthGuard(local(scope));
