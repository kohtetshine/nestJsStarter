import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/auth/requests/login.dto';
import { RegisterDto } from '../dto/auth/requests/register.dto';
import { ChangePasswordDto } from '../dto/auth/requests/change-password.dto';
import { UpdateUserDto } from '../dto/auth/requests/update-user.dto';
import { GetUsersDto } from '../dto/auth/requests/get-users.dto';
import { mapPrismaError } from '../prisma/prisma-exceptions';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      const password = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: ({ email: data.email, name: null, password } as any),
        select: { id: true, email: true, name: true, createdAt: true },
      });
      return user;
    } catch (err) {
      // Re-throw ConflictException and BadRequestException as-is, only map Prisma errors
      if (err instanceof ConflictException || err instanceof BadRequestException) {
        throw err;
      }
      throw mapPrismaError(err);
    }
  }

  async login(data: LoginDto) {
    try {
      const user = (await this.prisma.user.findUnique({
        where: { email: data.email },
      })) as any;
      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const ok = await bcrypt.compare(data.password, user.password);
      if (!ok) {
        throw new UnauthorizedException('Invalid credentials');
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: ({ lastLoginAt: new Date() } as any),
      });
      const token = this.jwtService.sign({ id: user.id, email: user.email });
      return { token, user: { id: user.id, email: user.email, name: user.name } };
    } catch (err) {
      // Re-throw UnauthorizedException as-is, only map Prisma errors
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw mapPrismaError(err);
    }
  }

  async changePassword(data: ChangePasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: { id: true, email: true, password: true },
      }) as any;

      if (!user || !user.password) {
        throw new UnauthorizedException('User not found');
      }

      const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

      await this.prisma.user.update({
        where: { id: data.userId },
        data: { password: hashedNewPassword },
      });

      return { message: 'Password changed successfully' };
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof BadRequestException) {
        throw err;
      }
      throw mapPrismaError(err);
    }
  }

  async updateUser(data: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if email is being updated and if it's already in use
      if (data.email && data.email !== user.email) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: data.email },
        });
        if (existingUser) {
          throw new ConflictException('Email already in use');
        }
      }

      // Build update data object with only provided fields
      const updateData: any = {};
      if (data.email !== undefined) updateData.email = data.email;
      if (data.name !== undefined) updateData.name = data.name;

      const updatedUser = await this.prisma.user.update({
        where: { id: data.userId },
        data: updateData,
        select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
      });

      return updatedUser;
    } catch (err) {
      if (err instanceof UnauthorizedException || err instanceof ConflictException) {
        throw err;
      }
      throw mapPrismaError(err);
    }
  }

  async getUsers(params: GetUsersDto) {
    try {
      const { limit = 10, page = 1, order = 'ASC' } = params;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            lastLoginAt: true,
          },
          orderBy: {
            createdAt: order.toLowerCase() as 'asc' | 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.user.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (err) {
      throw mapPrismaError(err);
    }
  }
}
