import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from '../src/Application/services/video.service';
import { VideosRepository } from '../src/Domain/Repositories/video.repository';
import { UploadVideoDto } from '../src/Presentation/Videos/dto/upload.dto';

describe('VideoService', () => {
    let videoService: VideoService;
    let videosRepository: VideosRepository;

    beforeEach(async () => {
        const mockVideosRepository = {
            handleUpload: jest.fn(),
            getVideoById: jest.fn(),
            deleteVideo: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VideoService,
                {
                    provide: VideosRepository,
                    useValue: mockVideosRepository,
                },
            ],
        }).compile();

        videoService = module.get<VideoService>(VideoService);
        videosRepository = module.get<VideosRepository>(VideosRepository);
    });

    describe('uploadVideo', () => {
        it('deve chamar o método handleUpload do repositório e retornar o videoID', async () => {
            const mockUploadDto: UploadVideoDto = {
                userId: '12345',
                video: {
                    buffer: Buffer.from('fake-video-buffer'),
                    fieldname: 'video',
                    originalname: 'test.mp4',
                    encoding: '7bit',
                    mimetype: 'video/mp4',
                    size: 1024,
                    stream: null,
                    destination: '',
                    filename: '',
                    path: '',
                } as any,
            };

            const mockVideoId = 'mock-video-id';
            jest.spyOn(videosRepository, 'handleUpload').mockResolvedValue(mockVideoId);

            const result = await videoService.uploadVideo(mockUploadDto);

            expect(videosRepository.handleUpload).toHaveBeenCalledWith(mockUploadDto);
            expect(result).toEqual(mockVideoId);
        });
    });

    describe('getById', () => {
        it('deve chamar o método getVideoById do repositório e retornar o vídeo', async () => {
            const mockVideo = { videoID: '123', userId: '456', fileBase64: 'abc' };
            jest.spyOn(videosRepository, 'getVideoById').mockResolvedValue(mockVideo);

            const result = await videoService.getById('123');

            expect(videosRepository.getVideoById).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockVideo);
        });
    });
});