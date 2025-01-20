import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async saveFileToS3(base64Content: string, fileName: string): Promise<string> {
    try {
 
      const buffer = Buffer.from(base64Content, 'base64');

      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'application/octet-stream',
      };

      const uploadResponse = await this.s3.upload(params).promise();

      return uploadResponse.Location;
    } catch (error) {
      throw new HttpException('Erro ao salvar o arquivo no S3', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}