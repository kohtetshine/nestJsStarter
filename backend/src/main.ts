import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*'});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT || 3000;
  // Basic auth for Swagger UI
  const swaggerUser = process.env.SWAGGER_USER || 'chat2mail';
  const swaggerPass = process.env.SWAGGER_PASSWORD || 'a8a8a8a8';
  app.use('/docs', (req: any, res: any, next: any) => {
    const authHeader = req.headers?.authorization as string | undefined;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.set('WWW-Authenticate', 'Basic realm="Swagger"');
      return res.status(401).send('Authentication required');
    }
    try {
      const base64 = authHeader.slice('Basic '.length).trim();
      const decoded = Buffer.from(base64, 'base64').toString('utf8');
      const sepIdx = decoded.indexOf(':');
      const user = sepIdx >= 0 ? decoded.slice(0, sepIdx) : '';
      const pass = sepIdx >= 0 ? decoded.slice(sepIdx + 1) : '';
      if (user === swaggerUser && pass === swaggerPass) return next();
    } catch (e) {
      // fallthrough to unauthorized
    }
    res.set('WWW-Authenticate', 'Basic realm="Swagger"');
    return res.status(401).send('Access denied');
  });
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
    swaggerOptions: { persistAuthorization: true },
  });
  // Prisma shutdown hooks (so Ctrl+C closes DB connections cleanly)
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(port as number, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
