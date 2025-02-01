import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SNSService {
  private readonly sns: AWS.SNS;
  private readonly snsTopicArn: string;

  private readonly AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
  private readonly AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  private readonly AWS_REGION = this.configService.get<string>('AWS_REGION');
  private readonly AWS_SESSION_TOKEN = this.configService.get<string>('AWS_SESSION_TOKEN');

  constructor(private readonly configService: ConfigService) {
    this.sns = new AWS.SNS({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
        sessionToken: this.AWS_SESSION_TOKEN
      },
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