import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  private readonly AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
  private readonly AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  private readonly AWS_REGION = this.configService.get<string>('AWS_REGION');
  private readonly AWS_SESSION_TOKEN = this.configService.get<string>('AWS_SESSION_TOKEN');

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
        sessionToken: this.AWS_SESSION_TOKEN
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async saveFileToS3(videoFile: Express.Multer.File, fileName: string): Promise<string> {
    
    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: videoFile.buffer,
        ContentType: videoFile.mimetype,
      };

      const uploadResponse = await this.s3.upload(params).promise();

      return uploadResponse.Location;
    } catch (error) {
      throw new HttpException('Erro ao salvar o arquivo no S3', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}