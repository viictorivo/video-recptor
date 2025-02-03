import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UploadVideoDto {
  @ApiProperty({
    description: 'ID do usuário que está enviando o vídeo',
    example: 'USERID',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'senha do usuário',
    example: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Arquivo de vídeo enviado pelo usuário',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  video: Express.Multer.File;
}