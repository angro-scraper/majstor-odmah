import { Body, Controller, Post } from "@nestjs/common";
import { AuthService, LoginDto, RegisterDto } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("register") register(@Body() input: RegisterDto) { return this.authService.register(input); }
  @Post("login") login(@Body() input: LoginDto) { return this.authService.login(input); }
}
