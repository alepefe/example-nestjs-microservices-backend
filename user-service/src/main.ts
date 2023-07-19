import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppLifeCycleControl } from './shared/infrastructure/app-life-cycle-control';
import { UserRepository } from './users/domain/user.repository';
import { JWTProvider } from './users/infrastructure/jwt/jwt-provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? false : ['verbose']
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 4000,
    },
  });
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });

  const appLifeCycleControl = app.get(AppLifeCycleControl);
  appLifeCycleControl.addExitEventHandler(100, app, 'close');

  const jWTProvider = app.get(JWTProvider);
  await jWTProvider.initialize();

  const userRepository = app.get(UserRepository);
  await userRepository.connect();

  await app.startAllMicroservices();
  await app.listen(3000);
}
void bootstrap();
