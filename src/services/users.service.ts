import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { SECURITY_OPTIONS } from '../security.constants';
import { CreateUserDTO, UpdateUserDTO } from '../dto/users.dto';
import { hash } from '../utils/hcrypt';
import { SecurityModuleOptions } from '../types/options';

@Injectable()
export class SecurityUsersService {
  constructor(
    @Inject(SECURITY_OPTIONS)
    private options: SecurityModuleOptions,
  ) {}

  async createUser<T extends CreateUserDTO = CreateUserDTO>(user: T) {
    if (typeof this.options.userCreator == 'string')
      throw new NotImplementedException();

    const exists = await this.options.userResolver.uniqueUser(user);

    if (!exists) throw new ConflictException();

    const password = await hash(user.password);

    user.password = password;
    return user;
  }

  async updateUser<T extends UpdateUserDTO = UpdateUserDTO>(
    username: string,
    user: Partial<T>,
  ) {
    if (typeof this.options.userUpdater == 'string') {
      throw new NotImplementedException();
    }

    const exists = await this.options.userResolver.getUser(username, false);

    if (!exists) throw new NotFoundException();

    if (typeof user.email != 'undefined') exists.email = user.email;
    if (typeof user.username != 'undefined') exists.username = user.username;
    if (typeof user.password != 'undefined') {
      const password = await hash(user.password);

      exists.password = password;
    }

    return await this.options.userUpdater.updateUser(username, user, exists);
  }
}
