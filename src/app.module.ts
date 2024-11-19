import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail/mail.processor';
import { QueueModule } from './queue/queue.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 2,
      },
    ]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    BullModule.registerFlowProducer({
      name: 'flowProducerEmailSlack',
    }),
    CacheModule.register({
      ttl: 5000,
      max: 10,
    }),
    AuthModule,
    UsersModule,
    MailModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    MailProcessor,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.connection.db.admin().ping();
      console.log('Kết nối MongoDB Atlas thành công!');
    } catch (error) {
      console.error('Kết nối MongoDB Atlas thất bại!', error);
    }
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).exclude('/auth').forRoutes('/products');
  }
}
