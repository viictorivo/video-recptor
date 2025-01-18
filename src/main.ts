import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de pedidos')
    .setDescription('Documentação da API de pedidos')
    .setVersion('1.0')
    .addTag('Pedidos') // Adicione tags relacionadas aos seus endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Acesse a documentação em /api

  await app.listen(3000);
}

bootstrap();
