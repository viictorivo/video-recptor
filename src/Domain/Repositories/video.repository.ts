import { Repository } from 'typeorm';
import { Video } from '../../Presentation/Videos/upload.entity';
import { UploadVideoDto } from '../../Presentation/Videos/dto/upload.dto';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { FileUploadService } from '../../Application/services/s3.service';
import { InjectRepository } from '@nestjs/typeorm';

@CustomRepository(Video)
export class VideosRepository extends Repository<Video>  {

  constructor(@InjectRepository(Video) private readonly videoRepo: Repository<Video>,
    private readonly fileUploadService: FileUploadService) {
    super(videoRepo.target, videoRepo.manager, videoRepo.queryRunner);
  }

  async handleUpload(uploadVideoDto: UploadVideoDto): Promise<string> {

    const { userId, video: videoFile } = uploadVideoDto

    const fileBase64 = videoFile.buffer.toString('base64');

    let upload = new Video()
    upload.videoID = uuidv4()
    upload.userId = userId
    upload.fileBase64 = fileBase64
    upload.status = 'pending'

    try {
      await this.fileUploadService.saveFileToS3(videoFile, upload.videoID);

      await upload.save();
      return upload.videoID;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro salvar video',
      );
    }
  }

  async getVideoById(id: string): Promise<any> {

    try {
      const video = await this.videoRepo.find({ where: { userId: id } });
      return video
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao consultar status no banco de dados',
      );
    }

  }

  async deleteVideo(id: string): Promise<any> {
    try {
      const videoID = await this.getVideoById(id);
      await this.videoRepo.remove(videoID);
      return "Video deletado"
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao deletar video do banco de dados',
      );
    }
  }


}