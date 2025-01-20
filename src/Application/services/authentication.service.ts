import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly authEndpoint = 'https://api.exemplo.com/auth/verify';

  constructor(private readonly httpService: HttpService) {}

  async verifyUserRegistration(userId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authEndpoint}?userId=${userId}`)
      );

      if (response.data && response.data.isRegistered) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new HttpException(
        'Erro ao verificar cadastro do usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}