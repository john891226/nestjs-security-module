import { CreateUserDTO } from '../dto/users.dto';

export type UniqueUserProps = {
  username: string;
  email: string;
};

export type User = CreateUserDTO & {
  uid: string;
};

export type UserPayload = Omit<User, 'password'>;
