import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { TypeOrmExModule } from './database/typeorm-ex.module';
import { UploadModule } from './Presentation/Videos/upload.module';
import { VideosRepository } from './Domain/Repositories/video.repository';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UploadModule, TypeOrmExModule.forCustomRepository([VideosRepository]),ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
