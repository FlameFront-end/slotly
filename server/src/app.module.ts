import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { OwnerModule } from './features/owner/owner.module';
import { ScheduleModule } from './features/schedule/schedule.module';
import { BookingsModule } from './features/bookings/bookings.module';
import { PublicModule } from './features/public/public.module';
import { User } from './features/auth/entities/user.entity';
import { OwnerProfile } from './features/owner/entities/owner-profile.entity';
import { Schedule } from './features/schedule/entities/schedule.entity';
import { Booking } from './features/bookings/entities/booking.entity';
import { RefreshToken } from './features/auth/entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'slotly'),
        entities: [User, OwnerProfile, Schedule, Booking, RefreshToken],
        synchronize:
          configService.get<string>('DB_SYNCHRONIZE') === 'true' ||
          configService.get<string>('NODE_ENV') === 'development',
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    OwnerModule,
    ScheduleModule,
    BookingsModule,
    PublicModule,
  ],
})
export class AppModule {}
