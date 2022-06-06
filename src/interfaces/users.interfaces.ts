import {
  UniqueUserProps,
  User as UserType,
  UserPayload as Payload,
} from '../types/user.types';
import { CreateUserDTO, UpdateUserDTO } from '../dto/users.dto';

export interface CreateUserInterface<T extends CreateUserDTO = CreateUserDTO> {
  createUser(user: T): Promise<void>;
}

export interface UpdateUserInterface<
  T extends UpdateUserDTO = UpdateUserDTO,
  User extends UserType = UserType,
> {
  updateUser(username: string, user: Partial<T>, old: User): Promise<void>;
}

export interface UserResolverInterface<
  User extends UserType = UserType,
  UserPayload extends Payload = Payload,
  Unique extends UniqueUserProps = UniqueUserProps,
> {
  uniqueUser(user: Unique): Promise<boolean>;
  getUser(user: string, uid?: boolean): Promise<User>;
  getUserPayload(user: string, uid?: boolean): Promise<UserPayload>;
}
