import { config } from 'dotenv'

config({ path: '.env' })

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './core/app.module'
import { EnvService } from './shared/infrastructure/env/env.service'
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const env = app.get(EnvService)

  app.enableCors({
    origin: env.get('FRONTEND_URL'),
    credentials: true,
  })

  app.useGlobalFilters(new DomainExceptionFilter())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AvantPro Vault')
    .setDescription('API de gerenciamento seguro de ambientes')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(env.get('PORT'))
}
bootstrap()
