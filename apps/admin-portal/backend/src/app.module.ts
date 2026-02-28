import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PackagesModule } from './packages/packages.module';
import { MqttModule } from './mqtt/mqtt.module';
import { LockersModule } from './lockers/lockers.module';

@Module({
  imports: [PrismaModule, PackagesModule, MqttModule, LockersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
