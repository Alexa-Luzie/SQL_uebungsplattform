"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlQueryController = void 0;
const common_1 = require("@nestjs/common");
const sqlQuery_service_1 = require("./sqlQuery.service");
const passport_1 = require("@nestjs/passport");
let SqlQueryController = class SqlQueryController {
    sqlQueryService;
    constructor(sqlQueryService) {
        this.sqlQueryService = sqlQueryService;
    }
    async executeSql(query, taskId, req) {
        if (!query || typeof query !== 'string' || !query.trim().toLowerCase().startsWith('select')) {
            throw new common_1.BadRequestException('Nur SELECT-Statements sind erlaubt.');
        }
        if (!taskId || typeof taskId !== 'string') {
            throw new common_1.BadRequestException('taskId ist erforderlich.');
        }
        return this.sqlQueryService.execute(query, req.user.userId, taskId);
    }
};
exports.SqlQueryController = SqlQueryController;
__decorate([
    (0, common_1.Post)('execute'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)('query')),
    __param(1, (0, common_1.Body)('taskId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SqlQueryController.prototype, "executeSql", null);
exports.SqlQueryController = SqlQueryController = __decorate([
    (0, common_1.Controller)('sql-query'),
    __metadata("design:paramtypes", [sqlQuery_service_1.SqlQueryService])
], SqlQueryController);
//# sourceMappingURL=sqlQuery.Controller.js.map