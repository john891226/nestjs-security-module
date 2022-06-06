import { Request } from 'express';
import { UserPayload, User } from '../types/user.types';

export type UserValidation<
  T extends UserPayload = UserPayload,
  U extends User = User,
> = {
  payload: T;
  user: U;
};

export interface UserValidatorInterface<
  T extends UserPayload = UserPayload,
  U extends User = User,
> {
  validateUser(
    username: string,
    password: string,
  ): Promise<UserValidation<T, U>>;
}

export interface UserAuthenticatorInterface<
  P extends UserPayload = UserPayload,
  U extends User = User,
> {
  signin(payload: P, user: U, request: Request): Promise<any>;
  signout(payload: P, user: U, request: Request): Promise<void>;
  guard(request: Request): Promise<P>;
}
