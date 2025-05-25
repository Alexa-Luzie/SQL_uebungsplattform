import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTaskDto: CreateTaskDto): import(".prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
    }[]>;
    findOne(id: number): import(".prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateTaskDto: UpdateTaskDto): import(".prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import(".prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
