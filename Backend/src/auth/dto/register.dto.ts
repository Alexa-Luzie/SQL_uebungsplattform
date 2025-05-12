import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {       //prüft ob die E-Mail gültig ist
  @IsEmail()
  email: string;

  @IsNotEmpty()                 // prüft ob der Name nicht leer ist
  name: string;

  @MinLength(6)                //sichert Mindestlänge fürs Passwort
  password: string;
}