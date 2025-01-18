import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsSqsService {
  private sqsClient: SQSClient;
  private readonly AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
  private readonly AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  private readonly AWS_REGION = this.configService.get<string>('AWS_REGION');
  private readonly AWS_SESSION_TOKEN = this.configService.get<string>('AWS_SESSION_TOKEN');

  constructor(private readonly configService: ConfigService) {
    this.sqsClient = new SQSClient({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
        sessionToken: this.AWS_SESSION_TOKEN

      },
    });
    
  }

  async sendMessage( queueUrl: string, message: any,) {
    const params = {
      DelaySeconds: 10,
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
    };

    await this.sqsClient.send(new SendMessageCommand(params));
  }
}