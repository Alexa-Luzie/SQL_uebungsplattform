import { SqlQueryService } from './sqlQuery.service';
export declare class SqlQueryController {
    private readonly sqlQueryService;
    constructor(sqlQueryService: SqlQueryService);
    executeSql(query: string, taskId: string, req: any): Promise<any>;
}
