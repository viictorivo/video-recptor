import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private readonly USER_API_URL = 'https://api.exemplo.com/users'; // Substitua pela sua URL base da API


  async verifyUserRegistration(userID: string): Promise<any> {
    try {

      const response: AxiosResponse = await axios.get(`${this.USER_API_URL}?userId=${userID}`);

      return response.data;
    } catch (error) {

      throw new HttpException(
        error.response?.data || 'Erro ao buscar os dados do usuário',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}



