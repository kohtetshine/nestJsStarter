import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new Error('Email already in use');
    }
    const password = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: ({ email: data.email, name: null, password } as any),
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return user;
  }

  async login(data: LoginDto) {
    const user = (await this.prisma.user.findUnique({
      where: { email: data.email },
    })) as any;
    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) {
      throw new Error('Invalid credentials');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: ({ lastLoginAt: new Date() } as any),
    });
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}
