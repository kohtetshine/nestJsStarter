import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, GetUsersDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseWrapped } from '../api-response/swagger';
import { RegisterResponseDto } from '../dto/responses/register-response.dto';
import { LoginResponseDto } from '../dto/responses/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponseWrapped(RegisterResponseDto)
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponseWrapped(LoginResponseDto)
  login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user from JWT' })
  me(@CurrentUser() user: any) {
    return { user };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination (staff only)' })
  getUsers(@Query() query: GetUsersDto) {
    return this.auth.getUsers(query);
  }
}
