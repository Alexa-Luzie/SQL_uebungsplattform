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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        try {
            const existingUser = await this.usersService.findByEmail(registerDto.email);
            if (existingUser) {
                console.warn(`Registrierung fehlgeschlagen: E-Mail ${registerDto.email} bereits registriert`);
                throw new common_1.ConflictException('E-Mail-Adresse ist bereits registriert');
            }
            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const user = await this.usersService.create({
                email: registerDto.email,
                name: registerDto.name,
                password: hashedPassword,
            });
            console.log(`Registrierung erfolgreich: ${user.email}`);
            return { ...user, name: user.name ?? '' };
        }
        catch (error) {
            console.error('Fehler beim Registrieren:', error);
            if (error.code === '23505') {
                throw new common_1.ConflictException('E-Mail-Adresse ist bereits registriert');
            }
            throw new common_1.InternalServerErrorException('Registrierung fehlgeschlagen');
        }
    }
    async login(dto) {
        try {
            const user = await this.usersService.findByEmail(dto.email);
            if (!user) {
                console.warn(`Login fehlgeschlagen: Benutzer nicht gefunden (${dto.email})`);
                throw new common_1.UnauthorizedException('Ungültige E-Mail oder Passwort.');
            }
            const isMatch = await bcrypt.compare(dto.password, user.password);
            if (!isMatch) {
                console.warn(`Login fehlgeschlagen: Ungültiges Passwort (${dto.email})`);
                throw new common_1.UnauthorizedException('Ungültige E-Mail oder Passwort.');
            }
            const payload = { sub: user.id, email: user.email, role: user.rolle };
            const token = this.jwtService.sign(payload);
            console.log(`Login erfolgreich für Benutzer: ${dto.email}`);
            return { access_token: token };
        }
        catch (error) {
            console.error('Fehler beim Login:', error);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map