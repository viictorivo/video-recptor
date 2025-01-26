import { Test, TestingModule } from '@nestjs/testing';
import { SNSService } from '../src/Application/services/sns.service';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
    const SNS = {
        publish: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    return { SNS: jest.fn(() => SNS) };
});

describe('SNSService', () => {
    let snsService: SNSService;
    let configService: ConfigService;
    let snsMock: AWS.SNS;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SNSService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const mockConfig = {
                                AWS_ACCESS_KEY_ID: 'mockAccessKey',
                                AWS_SECRET_ACCESS_KEY: 'mockSecretKey',
                                AWS_REGION: 'mockRegion',
                                AWS_SNS_TOPIC_ARN: 'mockTopicArn',
                            };
                            return mockConfig[key];
                        }),
                    },
                },
            ],
        }).compile();

        snsService = module.get<SNSService>(SNSService);
        configService = module.get<ConfigService>(ConfigService);
        snsMock = new AWS.SNS();
    });

    it('should be defined', () => {
        expect(snsService).toBeDefined();
    });
});