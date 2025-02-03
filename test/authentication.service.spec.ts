import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/Application/services/authentication.service';
import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock do axios
jest.mock('axios');

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    it('should return user data when user is registered', async () => {
        const mockUserID = '123';
        const mockUserPassword = 'password';
        const mockResponse = { data: { userId: '123', name: 'John Doe' } };

        // Mock do axios.get
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await authService.verifyUserRegistration(mockUserID, mockUserPassword);

        expect(result).toEqual(mockResponse.data);
    });

    it('should throw an HttpException if user registration fails', async () => {
        const mockUserID = '123';
        const mockUserPassword = 'password';
        const mockErrorResponse = { response: { data: 'User not found', status: 404 } };

        // Mock do axios.get para retornar erro
        (axios.get as jest.Mock).mockRejectedValue(mockErrorResponse);

        await expect(authService.verifyUserRegistration(mockUserID, mockUserPassword)).rejects.toThrowError(
            new HttpException('User not found', 404),
        );
    });

    it('should throw an HttpException with default message if there is an unknown error', async () => {
        const mockUserID = '123';
        const mockUserPassword = 'password';
        const mockErrorResponse = { response: null };

        // Mock do axios.get para retornar erro desconhecido
        (axios.get as jest.Mock).mockRejectedValue(mockErrorResponse);

        await expect(authService.verifyUserRegistration(mockUserID, mockUserPassword)).rejects.toThrowError(
            new HttpException('Erro ao buscar os dados do usuário', HttpStatus.INTERNAL_SERVER_ERROR),
        );
    });
});

function https(https: any, arg1: void) {
    throw new Error('Function not implemented.');
}
