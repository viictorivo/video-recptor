import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../src/Presentation/Videos/upload.controller';
import { VideoService } from '../src/Application/services/video.service';
import { AwsSqsService } from '../src/Application/services/sqs.service';
import { ConfigService } from '@nestjs/config';
import { SNSService } from '../src/Application/services/sns.service';
import { AuthService } from '../src/Application/services/authentication.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UploadController', () => {
  let uploadController: UploadController;
  let videoService: VideoService;
  let awsSqsService: AwsSqsService;
  let configService: ConfigService;
  let snsService: SNSService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            uploadVideo: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AwsSqsService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-queue-url'),
          },
        },
        {
          provide: SNSService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            verifyUserRegistration: jest.fn(),
          },
        },
      ],
    }).compile();

    uploadController = module.get<UploadController>(UploadController);
    videoService = module.get<VideoService>(VideoService);
    awsSqsService = module.get<AwsSqsService>(AwsSqsService);
    configService = module.get<ConfigService>(ConfigService);
    snsService = module.get<SNSService>(SNSService);
    authService = module.get<AuthService>(AuthService);
  });

  describe('uploadVideo', () => {
    it('deve fazer o upload do vídeo com sucesso', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);
      jest.spyOn(videoService, 'uploadVideo').mockResolvedValue('video-id');
      jest.spyOn(awsSqsService, 'sendMessage').mockResolvedValue(undefined);

      const file = { filename: 'video.mp4' } as Express.Multer.File;
      const dto = { userId: 'user-1', video: file };

      const result = await uploadController.uploadVideo(file, dto);

      expect(videoService.uploadVideo).toHaveBeenCalledWith(dto);
      expect(awsSqsService.sendMessage).toHaveBeenCalledWith('test-queue-url', 'video-id');
      expect(result).toEqual({ message: 'File uploaded successfully', videoId: 'video-id' });
    });

    it('deve lançar BadRequestException se o arquivo não for enviado', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);

      const dto = { userId: 'user-1', video: undefined };

      await expect(uploadController.uploadVideo(undefined, dto)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se ocorrer um erro no upload', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);
      jest.spyOn(videoService, 'uploadVideo').mockRejectedValue(new Error('Erro no upload'));

      const file = { filename: 'video.mp4' } as Express.Multer.File;
      const dto = { userId: 'user-1', video: file };

      await expect(uploadController.uploadVideo(file, dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVideoByUserID', () => {
    it('deve retornar o status do vídeo se o usuário for autenticado', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);
      jest.spyOn(videoService, 'getById').mockResolvedValue({ userId: 'video-1', status: 'uploaded' });

      const result = await uploadController.getVideoByUserID('user-1');

      expect(authService.verifyUserRegistration).toHaveBeenCalledWith('user-1');
      expect(videoService.getById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ userId: 'video-1', status: 'uploaded' });
    });

    it('deve lançar NotFoundException se ocorrer um erro', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);
      jest.spyOn(videoService, 'getById').mockRejectedValue(new Error('Video not found'));

      await expect(uploadController.getVideoByUserID('user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deve deletar o vídeo com sucesso se o usuário for autenticado', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);
      jest.spyOn(videoService, 'delete').mockResolvedValue(undefined);

      const result = await uploadController.delete('video-1', 'user-1');

      expect(authService.verifyUserRegistration).toHaveBeenCalledWith('user-1');
      expect(videoService.delete).toHaveBeenCalledWith('video-1');
      expect(result).toEqual('Video deletado');
    });

    it('deve lançar NotFoundException se o vídeo não for encontrado', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(true);
      jest.spyOn(videoService, 'delete').mockRejectedValue(new Error('Video not found'));

      await expect(uploadController.delete('video-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('deve retornar mensagem de "No auth" se o usuário não for autenticado', async () => {
      jest.spyOn(authService, 'verifyUserRegistration').mockResolvedValue(false);

      const result = await uploadController.delete('video-1', 'user-1');

      expect(authService.verifyUserRegistration).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ message: 'No auth' });
    });
  });
});