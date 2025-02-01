import { Test, TestingModule } from '@nestjs/testing';
import { VideosRepository } from '../src/Domain/Repositories/video.repository';
import { Video } from '../src/Presentation/Videos/upload.entity';
import { FileUploadService } from '../src/Application/services/s3.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';



jest.mock('../src/Application/services/s3.service'); // Mock para o serviço S3.

describe('VideosRepository', () => {
    let videosRepository: VideosRepository;
    let fileUploadService: FileUploadService;
    let videoRepo: Repository<Video>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VideosRepository,
                {
                    provide: getRepositoryToken(Video),
                    useClass: Repository,
                },
                FileUploadService,
            ],
        }).compile();

        videosRepository = module.get<VideosRepository>(VideosRepository);
        fileUploadService = module.get<FileUploadService>(FileUploadService);
        videoRepo = module.get<Repository<Video>>(getRepositoryToken(Video));
    });

    describe('getVideoById', () => {
        it('deve retornar um vídeo se encontrado', async () => {
            const mockVideo = { videoID: 'video123', userId: 'user123', fileBase64: 'base64string', status: 'pending' };
            jest.spyOn(videoRepo, 'find').mockResolvedValue(mockVideo as any);

            const result = await videosRepository.getVideoById('video123');

            expect(result).toEqual(mockVideo);
        });

        it('deve lançar um erro se ocorrer uma exceção', async () => {
            jest.spyOn(videoRepo, 'find').mockRejectedValue(new Error('DB Error'));

            await expect(videosRepository.getVideoById('video123')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deleteVideo', () => {
        it('deve deletar um vídeo e retornar a mensagem de sucesso', async () => {
            const mockVideo = { videoID: 'video123' };
            jest.spyOn(videosRepository, 'getVideoById').mockResolvedValue(mockVideo as any);
            jest.spyOn(videoRepo, 'remove').mockResolvedValue(undefined);

            const result = await videosRepository.deleteVideo('video123');

            expect(videoRepo.remove).toHaveBeenCalledWith(mockVideo);
            expect(result).toBe('Video deletado');
        });

        it('deve lançar um erro se ocorrer uma exceção', async () => {
            jest.spyOn(videosRepository, 'getVideoById').mockRejectedValue(new Error('DB Error'));

            await expect(videosRepository.deleteVideo('video123')).rejects.toThrow(InternalServerErrorException);
        });
    });
});