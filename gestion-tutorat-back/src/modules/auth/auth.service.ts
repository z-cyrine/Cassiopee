import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { UserService } from '../users/user.service';
import { UserRole } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { createUserDto } from '../users/dto/createUser.dto';

type SignInData = { userId: number; username:string; role: UserRole}
type AuthResult = {accessToken:string; userId:number; username:string; email:string; createdAt:string; role:string}
@Injectable()
export class AuthService {
    constructor(private userService:UserService, private jwtService:JwtService){}

    async validateUser(input: AuthPayloadDto): Promise<SignInData | null> {
        const user = await this.userService.findByEmail(input.email);

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(input.password, user.password);

        if (isPasswordValid) {
            return {
            userId: user.id,
            username: user.name,
            role: user.role
            };
        }

        return null;
    }


    async authenticate(input:AuthPayloadDto): Promise<AuthResult|null>{

        const user = await this.validateUser(input);



        if(!user){
            console.log('pas d\'utilisateur trouvé');
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.signIn(user);
    }

    async signIn(user:SignInData): Promise<AuthResult>{
        const userInDb = await this.userService.findById(user.userId);
        const tokenPayload = {
            sub: user.userId,
            username: user.username, 
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload);
        return {
          accessToken,
          username: user.username,
          userId: user.userId,
          email: userInDb.email,
          createdAt: userInDb.createdAt ? userInDb.createdAt.toISOString() : '',
          role: userInDb.role,
        };
    }

    async register(data: createUserDto): Promise<{ message: string }> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await this.userService.createUser({
            ...data,
            password: hashedPassword,
        });

        return { message: 'User registered successfully' };
    }

}
