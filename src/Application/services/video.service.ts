import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadVideoDto } from '../../Presentation/Videos/dto/upload.dto';
import { VideoUpdateDto } from '../../Presentation/Videos/dto/updateVideo.dto';
import { VideosRepository } from '../../Domain/Repositories/video.repository';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideosRepository)
    private readonly videoRepository: VideosRepository,
  ) {}

  async uploadVideo(uploadVideoDto: UploadVideoDto): Promise<any> {
    return this.videoRepository.handleUpload(uploadVideoDto);
  }

  async getById(id: string): Promise<UploadVideoDto> {
    return this.videoRepository.getVideoById(id);
  }

  async update(video: VideoUpdateDto): Promise<any> {
    return this.videoRepository.updateVideo(video);
  }

  async delete(id: string): Promise<any> {
    return this.videoRepository.deleteVideo(id);
  }
  
}