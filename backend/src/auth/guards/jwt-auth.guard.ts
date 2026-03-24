import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            // Secret should match config. Hardcoded for demonstration.
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'super-secret-key',
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
        return true;
    }

    private extractToken(request: Request): string | undefined {
        // 1. Try to extract from Authorization Header
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type === 'Bearer') return token;

        // 2. Try to extract from HTTP-only Cookie
        return request.cookies?.['access_token'];
    }
}
