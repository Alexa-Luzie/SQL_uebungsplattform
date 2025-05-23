import { JwtPayload } from './jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): Promise<{
        userId: string;
        email: string;
        rolle: string;
        name: string;
    }>;
}
export {};
