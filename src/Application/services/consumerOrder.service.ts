import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { AwsSqsService } from './sqs.service';
import { OrdersService } from './orders.service';

@Injectable()
export class SqsConsumerOrderService implements OnModuleInit, OnModuleDestroy {
  private sqsClient: SQSClient;
  private queueUrl: string;
  isRunning: boolean;

  private readonly AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
  private readonly AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  private readonly AWS_REGION = this.configService.get<string>('AWS_REGION');
  private readonly AWS_SESSION_TOKEN = this.configService.get<string>('AWS_SESSION_TOKEN');
  private readonly AWS_SQS_QUEUE_URL_ORDER_DONE = this.configService.get<string>('AWS_SQS_QUEUE_URL_ORDER_DONE');

  constructor(private ordersService: OrdersService, private readonly configService: ConfigService, private awsSqsService: AwsSqsService) {
    this.sqsClient = new SQSClient({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
        sessionToken: this.AWS_SESSION_TOKEN
      },
    });
    this.queueUrl = this.AWS_SQS_QUEUE_URL_ORDER_DONE; // URL da fila
  }

  async onModuleInit() {
    this.isRunning = true;
    this.listenToQueue();
  }

  async onModuleDestroy() {
    this.isRunning = false;
  }

  async listenToQueue() {
    while (this.isRunning) {
      try {
        // Recebe mensagens da fila
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10, // Máximo de mensagens por chamada
          WaitTimeSeconds: 10, // Long polling
        });

        const response = await this.sqsClient.send(command);

        if (response.Messages) {
          for (const message of response.Messages) {
            // Processa a mensagem
            await this.processMessage(message.Body);
          }
        }
      } catch (error) {
        console.error('Erro ao consumir mensagens da SQS:', error);
      }
    }
  }

  private async processMessage(messageBody: string): Promise<void> {
    const parseMessage = JSON.parse(messageBody)

    if(parseMessage.status == "DONE"){
      const queueUrl = this.AWS_SQS_QUEUE_URL_ORDER_DONE
      const message = "Pedido pronto";
  
      await this.awsSqsService.sendMessage(queueUrl, message)
      this.ordersService.update(parseMessage)
    }
    
  }
}