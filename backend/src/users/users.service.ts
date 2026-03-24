import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
    constructor(private db: DatabaseService) { }

    async create(data: { username: string; email: string; passwordHash: string; firstName: string; lastName: string; roleId: string }) {
        return this.db.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash: data.passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                roleId: data.roleId,
            }
        });
    }

    async findByEmail(email: string) {
        return this.db.user.findUnique({ where: { email } });
    }

    async findByUsername(username: string) {
        return this.db.user.findUnique({ where: { username } });
    }

    async findByEmailWithRole(email: string) {
        return this.db.user.findUnique({
            where: { email },
            include: { role: true }
        });
    }

    async findById(id: string) {
        return this.db.user.findUnique({ where: { id } });
    }

    async findByIdWithRole(id: string) {
        return this.db.user.findUnique({
            where: { id },
            include: { role: true }
        });
    }

    async updateRefreshToken(userId: string, hashedToken: string | null) {
        await this.db.user.update({
            where: { id: userId },
            data: { refreshToken: hashedToken },
        });
    }
}
