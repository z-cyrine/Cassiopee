import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { createUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
export class AuthController {

    constructor(private authservice: AuthService){}

    @Post('login')
    login(@Body() input:AuthPayloadDto){
        console.log('login');
        return this.authservice.authenticate(input);
    }

    @Post('register')
    register(@Body() input: createUserDto) {
        return this.authservice.register(input);
    }
}
