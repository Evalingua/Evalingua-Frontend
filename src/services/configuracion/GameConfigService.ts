import { AxiosResponse } from "axios";
import api from "../../interceptors/axiosConfig";
import { BaseResponse } from "../../types/page";
import { GameConfigRequest } from "../../types/config.type";

export class GameConfigService {
    private readonly BASE_URL = '/game-config';

    async createEvaluacion(request: GameConfigRequest): Promise<BaseResponse<string>> {
        const response: AxiosResponse<BaseResponse<string>> = await api.post(`${this.BASE_URL}/generate`, request);
        return response.data;
    }

    async validarRedis(): Promise<BaseResponse<string>> {
        const response: AxiosResponse<BaseResponse<string>> = await api.get(`${this.BASE_URL}/test-connection`);
        return response.data;
    }
}