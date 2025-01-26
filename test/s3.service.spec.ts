import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from '../src/Application/services/s3.service';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
    const S3 = {
        upload: jest.fn().mockReturnThis(),
        promise: jest.fn(), // Mock explícito
    };
    return { S3: jest.fn(() => S3) };
});

describe('FileUploadService', () => {
    let fileUploadService: FileUploadService;
    let configService: ConfigService;
    let s3Mock: AWS.S3;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileUploadService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const mockConfig = {
                                AWS_ACCESS_KEY_ID: 'mockAccessKey',
                                AWS_SECRET_ACCESS_KEY: 'mockSecretKey',
                                AWS_REGION: 'mockRegion',
                                AWS_S3_BUCKET_NAME: 'mockBucketName',
                            };
                            return mockConfig[key];
                        }),
                    },
                },
            ],
        }).compile();

        fileUploadService = module.get<FileUploadService>(FileUploadService);
        configService = module.get<ConfigService>(ConfigService);
        s3Mock = new AWS.S3();
    });

    it('should be defined', () => {
        expect(fileUploadService).toBeDefined();
    });
});