import { Controller, Post, Body, Req, Res, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        return { 
            message: 'Registered and logged in successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        return { 
            message: 'Logged in successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: Request) {
        return req.user;
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userId = (req.user as any).sub;
        await this.authService.logout(userId);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @Post('refresh')
    async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.['refresh_token'];
        if (!refreshToken) {
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'No refresh token' });
        }

        try {
            // Basic JWT parse to get User ID
            const parsed = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
            const userId = parsed.sub;

            const tokens = await this.authService.refreshTokens(userId, refreshToken);
            this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

            return { 
                message: 'Token refreshed successfully',
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            };
        } catch (error) {
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid refresh token' });
        }
    }

    private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
        const isProd = process.env.NODE_ENV === 'production';
        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 mins (match JWT expiry)
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
}
