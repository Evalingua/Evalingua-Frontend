import api from "../../interceptors/axiosConfig";
import { AxiosResponse } from "axios";
import { BasePageResponse, BaseResponse } from "../../types/page";
import { ListEvaluacionRequest, ListEvaluacionResponse, NewEvaluacionRequest, NewEvaluacionResponse, ProximaEvaluacionResponse, UltimosResultados } from "../../types/evaluacion.type";

export class EvaluacionService {
    private readonly BASE_URL = '/evaluacion';

    async createEvaluacion(paciente: NewEvaluacionRequest): Promise<BaseResponse<NewEvaluacionResponse>> {
        const response: AxiosResponse<BaseResponse<NewEvaluacionResponse>> = await api.post(`${this.BASE_URL}/create`, paciente);
        return response.data;
    }

    async anularEvaluacion(id: string): Promise<BaseResponse<ListEvaluacionResponse>> {
        const response: AxiosResponse<BaseResponse<ListEvaluacionResponse>> = await api.delete(`${this.BASE_URL}/anular/${id}`);
        return response.data;
    }

    async getAllEvaluaciones(request: ListEvaluacionRequest): Promise<BasePageResponse<ListEvaluacionResponse>> {
        const response: AxiosResponse<BasePageResponse<ListEvaluacionResponse>> = await api.post(`${this.BASE_URL}/listar`, request);
        return response.data;
    }

    async getProximasEvaluaciones(): Promise<BaseResponse<ProximaEvaluacionResponse[]>> {
        const response: AxiosResponse<BaseResponse<ProximaEvaluacionResponse[]>> = await api.get(`${this.BASE_URL}/proximas-evaluaciones`);
        return response.data;
    }

    async getUltimosResultados(dni: string): Promise<BaseResponse<UltimosResultados[]>> {
        const response: AxiosResponse<BaseResponse<UltimosResultados[]>> = await api.get(`${this.BASE_URL}/paciente/${dni}/ultimos-resultados`);
        return response.data;
    }
}