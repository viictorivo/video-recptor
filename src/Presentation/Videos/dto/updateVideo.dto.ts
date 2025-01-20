import {
    IsDate,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class VideoUpdateDto {
    @IsOptional()
    @IsNumber()
    videoID: string;
  
    @IsOptional()
    @IsString()
    status: string;
  }