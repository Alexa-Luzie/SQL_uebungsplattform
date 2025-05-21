import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<any | null>;
    create(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<User>;
    findById(id: string): Promise<any | null>;
    findAll(): Promise<any[]>;
    getUserRole(userId: string): Promise<string | null>;
}
