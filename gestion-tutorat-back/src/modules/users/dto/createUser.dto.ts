import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class createUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  password?: string;
}
