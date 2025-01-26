import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { VideoService } from '../../Application/services/video.service';
import { Video } from './upload.entity';
import { AwsSqsService } from '../../Application/services/sqs.service'
import { SNSService } from '../../Application/services/sns.service'
import { AuthService } from '../../Application/services/authentication.service'
import { VideosRepository } from '../../Domain/Repositories/video.repository';



@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  controllers: [UploadController],
  providers: [
    { provide: VideosRepository, useClass: VideosRepository },
    VideoService,
    AwsSqsService,
    SNSService,
    AuthService,
  ],
})
export class UploadModule { }