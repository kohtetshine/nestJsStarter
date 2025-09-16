import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  // Placeholder for Redis client access
  ping(): string {
    return 'redis-service-ok';
  }
}

