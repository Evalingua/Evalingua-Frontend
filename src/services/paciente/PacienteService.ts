import api from "../../interceptors/axiosConfig";
import { AxiosResponse } from "axios";
import { BasePageResponse, BaseResponse } from "../../types/page";
import { ListarPacienteRequest, PacienteRequest, PacienteResponse } from "../../types/paciente";

export class PacienteService {
    private readonly BASE_URL = '/paciente';

    async getPacienteByDni(dni: string): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> = await api.get(`${this.BASE_URL}/dni/${dni}`);
        return response.data;
    }

    async getAllPacientes(request: ListarPacienteRequest): Promise<BasePageResponse<PacienteResponse>> {
        const response: AxiosResponse<BasePageResponse<PacienteResponse>> = await api.post(`${this.BASE_URL}/listar`, request);
        return response.data;
    }

    async createPaciente(paciente: PacienteRequest): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> = await api.post(`${this.BASE_URL}/nuevo`, paciente);
        return response.data;
    }

    async updatePaciente(dni:string, paciente: PacienteRequest): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> =
          await api.put(`${this.BASE_URL}/${dni}`, paciente);
        return response.data;
    }

    async deletePaciente(dni: number): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> = await api.post(`${this.BASE_URL}/delete/${dni}`);
        return response.data;
    }
}