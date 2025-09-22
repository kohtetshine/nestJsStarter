import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';

type MaybePrismaError = Error & { code?: string } & { meta?: any };

export function mapPrismaError(err: unknown): HttpException {
  const e = err as MaybePrismaError;
  const name = (e as any)?.name as string | undefined;
  // Known request errors
  switch (e?.code) {
    case 'P2002':
      return new ConflictException('Email already in use');
    case 'P1000':
    case 'P1001':
    case 'P1008':
    case 'P1017':
      return new ServiceUnavailableException('Database is not available');
    default:
      break;
  }
  // Network-like errors
  const msg = e?.message || '';
  if (
    msg.includes('ECONNREFUSED') ||
    msg.includes('getaddrinfo') ||
    name === 'PrismaClientInitializationError' ||
    msg.includes('Query engine library') ||
    msg.includes('Unable to load')
  ) {
    return new ServiceUnavailableException('Database is not available');
  }
  return new InternalServerErrorException('Something went wrong');
}
