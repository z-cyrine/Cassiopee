import { IsEmail, IsNotEmpty } from 'class-validator';

export class createUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}
