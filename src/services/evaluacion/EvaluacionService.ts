import api from "../../interceptors/axiosConfig";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../types/page";
import { NewEvaluacionRequest, NewEvaluacionResponse } from "../../types/evaluacion.type";

export class EvaluacionService {
    private readonly BASE_URL = '/evaluacion';

    async createEvaluacion(paciente: NewEvaluacionRequest): Promise<BaseResponse<NewEvaluacionResponse>> {
        const response: AxiosResponse<BaseResponse<NewEvaluacionResponse>> = await api.post(`${this.BASE_URL}/create`, paciente);
        return response.data;
    }
}