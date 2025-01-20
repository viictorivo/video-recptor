import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UploadVideoDto {
  @ApiProperty({
    description: 'ID do usuário que está enviando o vídeo',
    example: 'e4f50d8c-6e43-4e0d-a1dc-6ad3bfb2c5ab',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Arquivo de vídeo enviado pelo usuário',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  video: Express.Multer.File;
}