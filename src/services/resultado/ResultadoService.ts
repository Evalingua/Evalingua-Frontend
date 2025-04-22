import { AxiosResponse } from "axios";
import api from "../../interceptors/axiosConfig";
import { BasePageResponse, BaseResponse } from "../../types/page";
import { ListResultadoRequest, NewResultadoRequest, ResultadoDTOResponse } from "../../types/resultado.type";

export class ResultadoService {
    private readonly BASE_URL = '/resultado';

    async createResultado(request: NewResultadoRequest): Promise<BaseResponse<ResultadoDTOResponse>> {
        const response: AxiosResponse<BaseResponse<ResultadoDTOResponse>> = await api.post(`${this.BASE_URL}/create`, request);
        return response.data;
    }

    async getResultados(request: ListResultadoRequest): Promise<BasePageResponse<ResultadoDTOResponse>> {
        const response: AxiosResponse<BasePageResponse<ResultadoDTOResponse>> = await api.post(`${this.BASE_URL}/listar`, request);
        return response.data;
    }
}