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
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UploadVideoDto } from './dto/upload.dto';
  import { VideoUpdateDto } from './dto/updateVideo.dto';
  import { VideoService } from '../../Application/services/video.service';
  import { AwsSqsService } from '../../Application/services/sqs.service';
  import { ConfigService } from '@nestjs/config';
  import { SNSService } from '../../Application/services/sns.service';

  @Controller('upload')
  export class UploadController {

    private readonly AWS_SQS_QUEUE_URL_PAYMENT_INBOUND = this.configService.get<string>('AWS_SQS_QUEUE_URL_PAYMENT_INBOUND');
    
    constructor(private readonly videoService: VideoService, 
                private awsSqsService: AwsSqsService,
                private readonly configService: ConfigService,
                private snsService: SNSService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('video'))
    async uploadVideo(
      @UploadedFile() file: Express.Multer.File,
      @Body() uploadVideoDto: UploadVideoDto,
    ) {
      if (!file) {
        throw new BadRequestException('No video file uploaded');
      }

      try{
        const queueUrl = this.AWS_SQS_QUEUE_URL_PAYMENT_INBOUND
  
        // Garante que o arquivo de vídeo seja incluído no DTO
        uploadVideoDto.video = file;
    
        const videoId = await this.videoService.uploadVideo(uploadVideoDto);
    
        await this.awsSqsService.sendMessage(queueUrl, videoId)
    
        return {
          message: 'File uploaded successfully',
          videoId,
        };
      } catch (err){
        const message = "Erro ao fazer upload do video"
        const subject = "Erro ao fazer upload do video"
        await this.snsService.sendEmail(message, subject);

        throw new NotFoundException(err?.message ?? 'Video not uploaded');
      }


    }

    @Get()
    async getVideoByID(@Param('id') id: number){
      try {
        const order = await this.videoService.getById(String(id));
        return order;
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Video could not be list');
        }
    }

    @Patch()
    async update(@Body() dto: VideoUpdateDto) {
        try {
        const order = await this.videoService.update(dto);
        return order;
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Video Status could not be updated');
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
        await this.videoService.delete(String(id));
        return "Video deletado";
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Video could not be deleted');
        }
    }
  }