import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Patch,
  Delete,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadVideoDto } from './dto/upload.dto';
import { VideoService } from '../../Application/services/video.service';
import { AwsSqsService } from '../../Application/services/sqs.service';
import { ConfigService } from '@nestjs/config';
import { SNSService } from '../../Application/services/sns.service';
import { AuthService } from '../../Application/services/authentication.service';

@Controller('upload')
export class UploadController {

  private readonly AWS_SQS_QUEUE_URL_UPLOAD_VIDEO = this.configService.get<string>('AWS_SQS_QUEUE_URL_UPLOAD_VIDEO');

  constructor(private readonly videoService: VideoService,
    private awsSqsService: AwsSqsService,
    private readonly configService: ConfigService,
    private snsService: SNSService,
    private authService: AuthService) { }

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadVideoDto: UploadVideoDto,
  ) {

    const { userId, password } = uploadVideoDto;

    const auth = await this.authService.verifyUserRegistration(userId, password);

    if (auth) {
      if (!file) {
        const message = "Erro ao fazer upload do video"
        const subject = "Erro ao fazer upload do video"
        await this.snsService.sendEmail(subject, message);
        throw new BadRequestException('No video file uploaded');
      }

      try {
        const queueUrl = this.AWS_SQS_QUEUE_URL_UPLOAD_VIDEO

        // Garante que o arquivo de vídeo seja incluído no DTO
        uploadVideoDto.video = file;

        const videoId = await this.videoService.uploadVideo(uploadVideoDto);
        const message = { "key": videoId }

        await this.awsSqsService.sendMessage(queueUrl, message)

        return {
          message: 'File uploaded successfully',
          videoId,
        };
      } catch (err) {
        const message = "Erro ao fazer upload do video"
        const subject = "Erro ao fazer upload do video"
        await this.snsService.sendEmail(subject, message);

        throw new NotFoundException(err?.message ?? 'Video not uploaded');
      }
    } else {
      return {
        message: 'No auth',
      }
    }

  }

  @Get()
  async getVideoByUserID(@Query('userId') userId: string, @Query('password') password: string) {

    const auth = await this.authService.verifyUserRegistration(userId, password);

    if (auth) {
      try {
        const videoStatus = await this.videoService.getById(String(userId));
        return videoStatus;
      } catch (err) {
        throw new NotFoundException(err?.message ?? 'Video could not be list');
      }
    } else {
      return {
        message: 'No auth',
      }
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userID') userID: string, @Query('password') password: string) {

    const auth = await this.authService.verifyUserRegistration(userID, password);

    if (auth) {
      try {
        await this.videoService.delete(String(id));
        return "Video deletado";
      } catch (err) {
        throw new NotFoundException(err?.message ?? 'Video could not be deleted');
      }
    } else {
      return {
        message: 'No auth',
      }
    }

  }
}