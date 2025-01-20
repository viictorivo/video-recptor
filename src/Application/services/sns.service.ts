import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SNSService {
  private readonly sns: AWS.SNS;
  private readonly snsTopicArn: string;

  constructor(private readonly configService: ConfigService) {
    this.sns = new AWS.SNS({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.snsTopicArn = this.configService.get<string>('AWS_SNS_TOPIC_ARN');
  }

  async sendEmail(subject: string, message: string): Promise<AWS.SNS.PublishResponse> {
    try {
      const params: AWS.SNS.PublishInput = {
        Message: message,
        Subject: subject,
        TopicArn: this.snsTopicArn,
      };

      const response = await this.sns.publish(params).promise();

      return response;
    } catch (error) {
      throw new HttpException('Erro ao enviar e-mail via SNS', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}