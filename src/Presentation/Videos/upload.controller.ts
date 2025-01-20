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
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly videoService: VideoService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('video'))
    async uploadVideo(
      @UploadedFile() file: Express.Multer.File,
      @Body() uploadVideoDto: UploadVideoDto,
    ) {
      if (!file) {
        throw new BadRequestException('No video file uploaded');
      }
  
      // Garante que o arquivo de vídeo seja incluído no DTO
      uploadVideoDto.video = file;
  
      const videoId = await this.videoService.uploadVideo(uploadVideoDto);
  
      return {
        message: 'File uploaded successfully',
        videoId,
      };
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
        throw new NotFoundException(err?.message ?? 'Order could not be updated');
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
        await this.videoService.delete(String(id));
        return "Video deletado";
        } catch (err) {
        throw new NotFoundException(err?.message ?? 'Order could not be deleted');
        }
    }
  }