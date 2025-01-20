import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { VideoService } from '../../Application/services/video.service';
import { Video } from './upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [UploadController],
  providers: [VideoService],
})
export class UploadModule {}