import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/auth/requests/login.dto';
import { RegisterDto } from '../dto/auth/requests/register.dto';
import { ChangePasswordDto } from '../dto/auth/requests/change-password.dto';
import { UpdateUserDto } from '../dto/auth/requests/update-user.dto';
import { GetUsersDto } from '../dto/auth/requests/get-users.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiOkResponseWrapped } from '../api-response/swagger';
import { RegisterResponseDto } from '../dto/auth/responses/register-response.dto';
import { LoginResponseDto } from '../dto/auth/responses/login-response.dto';
import { ChangePasswordResponseDto } from '../dto/auth/responses/change-password-response.dto';
import { UpdateUserResponseDto } from '../dto/auth/responses/update-user-response.dto';

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

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponseWrapped(ChangePasswordResponseDto)
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() body: ChangePasswordDto) {
    return this.auth.changePassword(body);
  }

  @Put('update-user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user information' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponseWrapped(UpdateUserResponseDto)
  @HttpCode(HttpStatus.OK)
  updateUser(@Body() body: UpdateUserDto) {
    return this.auth.updateUser(body);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users with pagination (staff only)' })
  getUsers(@Query() query: GetUsersDto) {
    return this.auth.getUsers(query);
  }
}
