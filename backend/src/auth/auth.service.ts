import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private db: DatabaseService,
    ) { }

    async register(dto: RegisterDto) {
        const emailExisting = await this.usersService.findByEmail(dto.email);
        if (emailExisting) {
            throw new ConflictException('Email already in use');
        }

        const usernameExisting = await this.usersService.findByUsername(dto.username);
        if (usernameExisting) {
            throw new ConflictException('Username already in use');
        }

        // Fetch or create default role
        let role = await this.db.role.findUnique({ where: { name: 'USER' } });
        if (!role) {
            role = await this.db.role.create({ data: { name: 'USER' } });
        }

        const passwordHash = await argon2.hash(dto.password);

        const user = await this.usersService.create({
            username: dto.username,
            email: dto.email,
            passwordHash,
            firstName: dto.firstName || '',
            lastName: dto.lastName || '',
            roleId: role.id,
        });

        const tokens = await this.generateTokens(user.id, user.email, role.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmailWithRole(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await argon2.verify(user.passwordHash, dto.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async refreshTokens(userId: string, rt: string) {
        const user = await this.usersService.findByIdWithRole(userId);
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Access denied');
        }

        const rtMatches = await argon2.verify(user.refreshToken, rt);
        if (!rtMatches) {
            throw new UnauthorizedException('Access denied');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);
    }

    private async generateTokens(userId: string, email: string, roleName: string) {
        const payload = { sub: userId, email, role: roleName };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET || 'super-secret-key',
                expiresIn: (process.env.JWT_EXPIRATION_TIME || '15m') as any,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
                expiresIn: (process.env.JWT_REFRESH_EXPIRATION_TIME || '7d') as any,
            }),
        ]);
        return { accessToken, refreshToken };
    }

    private async updateRefreshToken(userId: string, rt: string) {
        const hash = await argon2.hash(rt);
        await this.usersService.updateRefreshToken(userId, hash);
    }
}
