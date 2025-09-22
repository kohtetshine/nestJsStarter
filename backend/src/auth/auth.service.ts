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
import { LoginDto, RegisterDto, GetUsersDto } from './dto/auth.dto';
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
