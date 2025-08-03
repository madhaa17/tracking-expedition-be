import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthResponse } from './response/auth-login-response';
import { AuthRegisterDto } from './dto/auth-register-dto';

@Controller('auth')
export class AuthController {
    constructor(private authservice: AuthService) {}

    @Post('login')
    async login(@Body() request: AuthLoginDto): Promise<AuthResponse> {
        return this.authservice.login(request);
    }

    @Post('register')
    async register(@Body() request: AuthRegisterDto): Promise<AuthResponse> {
        return this.authservice.register(request);
    }
}
