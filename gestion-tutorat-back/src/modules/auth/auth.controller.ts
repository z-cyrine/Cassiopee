import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { createUserDto } from '../users/dto/createUser.dto';
import { AlreadyAuthGuard } from './jwt/guards/already-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authservice: AuthService){}

    @UseGuards(AlreadyAuthGuard)
    @Post('login')
    login(@Body() input:AuthPayloadDto){
        console.log('login');
        return this.authservice.authenticate(input);
    }

    @UseGuards(AlreadyAuthGuard)
    @Post('register')
    register(@Body() input: createUserDto) {
        return this.authservice.register(input);
    }
}