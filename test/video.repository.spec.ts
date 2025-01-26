import { Test, TestingModule } from '@nestjs/testing';
import { VideosRepository } from '../src/Domain/Repositories/video.repository';
import { UploadVideoDto } from '../src/Presentation/Videos/dto/upload.dto';
import { Video } from '../src/Presentation/Videos/upload.entity';
import { FileUploadService } from '../src/Application/services/s3.service';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('../src/Application/services/s3.service'); // Mock para o serviço S3.

describe('VideosRepository', () => {
    let videosRepository: VideosRepository;
    let fileUploadService: FileUploadService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VideosRepository,
                {
                    provide: FileUploadService,
                    useValue: {
                        saveFileToS3: jest.fn(),
                    },
                },
            ],
        }).compile();

        videosRepository = module.get<VideosRepository>(VideosRepository);
        fileUploadService = module.get<FileUploadService>(FileUploadService);
    });

    describe('getVideoById', () => {
        it('deve retornar o vídeo com o ID fornecido', async () => {
            const mockVideo = { videoID: '123', userId: '456', fileBase64: 'abc' };
            jest.spyOn(Video, 'findOne').mockResolvedValue(mockVideo as Video);

            const result = await videosRepository.getVideoById('123');
            expect(result).toEqual(mockVideo);
        });

        it('deve lançar um erro se falhar ao buscar o vídeo', async () => {
            jest.spyOn(Video, 'findOne').mockRejectedValue(new Error());

            await expect(videosRepository.getVideoById('123')).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('deleteVideo', () => {
        it('deve lançar um erro se falhar ao deletar o vídeo', async () => {
            jest.spyOn(videosRepository, 'getVideoById').mockRejectedValue(
                new Error(),
            );

            await expect(videosRepository.deleteVideo('123')).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });
});