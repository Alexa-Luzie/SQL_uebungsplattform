import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): import("node_modules/.prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
        solution: string;
    }, never, import("node_modules/@prisma/client/runtime/library").DefaultArgs, import("node_modules/.prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("node_modules/.prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
        solution: string;
    }[]>;
    findOne(id: string): import("node_modules/.prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
        solution: string;
    } | null, null, import("node_modules/@prisma/client/runtime/library").DefaultArgs, import("node_modules/.prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateTaskDto: UpdateTaskDto): import("node_modules/.prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
        solution: string;
    }, never, import("node_modules/@prisma/client/runtime/library").DefaultArgs, import("node_modules/.prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("node_modules/.prisma/client").Prisma.Prisma__TaskClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        database: string;
        solution: string;
    }, never, import("node_modules/@prisma/client/runtime/library").DefaultArgs, import("node_modules/.prisma/client").Prisma.PrismaClientOptions>;
}
