import { Repository } from 'typeorm';
import { Video } from '../../Presentation/Videos/upload.entity';
import { UploadVideoDto } from '../../Presentation/Videos/dto/upload.dto';
import { CustomRepository } from '../../database/typeorm-ex.decorator';
import { v4 as uuidv4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';
import { FileUploadService } from '../../Application/services/s3.service';

@CustomRepository(Video)
export class VideosRepository extends Repository<Video>  {

  private fileUploadService: FileUploadService

  async handleUpload(uploadVideoDto: UploadVideoDto): Promise<string> {

    const { userId, video: videoFile } = uploadVideoDto

    const fileBase64 = videoFile.buffer.toString('base64');

    let upload = new Video()
    upload.videoID = uuidv4(),
      upload.userId = userId
    upload.fileBase64 = fileBase64
    upload.status = 'pending'

    try {
      await upload.save();
      await this.fileUploadService.saveFileToS3(userId, fileBase64);
      return upload.videoID;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro salvar video',
      );
    }
  }

  async getVideoById(id: string): Promise<any> {

    try {
      const video = await Video.findOne({ where: { videoID: id } });
      return video
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        'Erro ao consultar status no banco de dados',
      );
    }

  }

  async deleteVideo(id: string): Promise<any> {
    try {
      const videoID = await this.getVideoById(id);
      await Video.remove(videoID);
      return "Video deletado"
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        'Erro ao deletar video do banco de dados',
      );
    }
  }


}