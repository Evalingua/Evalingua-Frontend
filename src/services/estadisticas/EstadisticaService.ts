import { AxiosResponse } from "axios";
import { BaseResponse } from "../../types/page";
import api from "../../interceptors/axiosConfig";
import { GraficoDTO, PieChartDTO } from "../../types/estadistica.type";

export class EstadisticaService {
    private readonly BASE_URL = '/estadisticas';

    async getEstadisticasEvolucionPaciente(dni: string): Promise<BaseResponse<GraficoDTO>> {
        const response: AxiosResponse<BaseResponse<GraficoDTO>> = await api.get(`${this.BASE_URL}/evolucion-paciente/${dni}`);
        return response.data;
    }

    async getEstadisticasGlobales(): Promise<BaseResponse<GraficoDTO>> {
        const response: AxiosResponse<BaseResponse<GraficoDTO>> = await api.get(`${this.BASE_URL}/grafico-general`);
        return response.data;
    }

    async getTrastornoFrecuencia(): Promise<BaseResponse<GraficoDTO>> {
        const response: AxiosResponse<BaseResponse<GraficoDTO>> = await api.get(`${this.BASE_URL}/trastorno-frecuencia`);
        return response.data;
    }

    async getTopFonemaErrores(): Promise<BaseResponse<GraficoDTO>> {
        const response: AxiosResponse<BaseResponse<GraficoDTO>> = await api.get(`${this.BASE_URL}/top-fonemas-errores`);
        return response.data;
    }

    async getAlteracionNivel(): Promise<BaseResponse<GraficoDTO>> {
        const response: AxiosResponse<BaseResponse<GraficoDTO>> = await api.get(`${this.BASE_URL}/alteracion-nivel`);
        return response.data;
    }

    async getAlteracionDistribucion(): Promise<BaseResponse<PieChartDTO>> {
        const response: AxiosResponse<BaseResponse<PieChartDTO>> = await api.get(`${this.BASE_URL}/alteracion-distribucion`);
        return response.data;
    }

    async getLogradosVsErrores(): Promise<BaseResponse<GraficoDTO>> {
        const response: AxiosResponse<BaseResponse<GraficoDTO>> = await api.get(`${this.BASE_URL}/logrados-vs-errores`);
        return response.data;
    }
}
