import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<{
        id: any;
        email: any;
        name: any;
        rolle: any;
    }>;
    getAll(req: any): Promise<any[]>;
}
