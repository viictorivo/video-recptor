import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private readonly USER_API_URL = 'https://3iz8andazg.execute-api.us-east-1.amazonaws.com/dev/getUser'; // Substitua pela sua URL base da API


  async verifyUserRegistration(userID: string, password: string): Promise<any> {
    try {

      const response: AxiosResponse = await axios.get(`${this.USER_API_URL}?userName=${userID}&password=${password}`);

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao buscar os dados do usuário',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}



