import api from "../../../interceptors/axiosConfig";
import { AxiosResponse } from "axios";
import { BaseResponse, PageResponse } from "../../../types/page";
import { PacienteRequest, PacienteResponse } from "../../../types/paciente";

export class PacienteService {
    private readonly BASE_URL = '/paciente';

    async getAllPacientes(): Promise<PageResponse<PacienteResponse>> {
        const response: AxiosResponse<PageResponse<PacienteResponse>> = await api.get(`${this.BASE_URL}/allValids`);
        return response.data;
    }

    async getPacienteByDni(dni: number): Promise<PageResponse<PacienteResponse>> {
        const response: AxiosResponse<PageResponse<PacienteResponse>> = await api.get(`${this.BASE_URL}/dni/${dni}`);
        return response.data;
    }

    async getPacienteByNombre(nombre: string): Promise<PageResponse<PacienteResponse>> {
        const response: AxiosResponse<PageResponse<PacienteResponse>> = await api.get(`${this.BASE_URL}/nombre/${nombre}`);
        return response.data;
    }

    async createPaciente(paciente: PacienteRequest): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> = await api.post(this.BASE_URL, paciente);
        return response.data;
    }

    async updatePaciente(dni:number, paciente: PacienteRequest): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> =
          await api.put(`${this.BASE_URL}/${dni}`, paciente);
        return response.data;
    }

    async deletePaciente(dni: number): Promise<BaseResponse<PacienteResponse>> {
        const response: AxiosResponse<BaseResponse<PacienteResponse>> = await api.post(`${this.BASE_URL}/delete/${dni}`);
        return response.data;
    }
}