import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

class CommonUser {
  @ApiProperty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}

export class CreateUserDTO extends CommonUser {
  @ApiProperty()
  @MinLength(8)
  password: string;
}

export class UpdateUserDTO extends CreateUserDTO {
  @ApiPropertyOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional()
  @MinLength(3)
  username: string;
}

export class UserDTO extends CommonUser {
  @ApiProperty()
  uid: string;
}
