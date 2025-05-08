import { AxiosResponse } from "axios";
import api from "../../interceptors/axiosConfig";

export class ReporteService {
    private readonly BASE_URL = '/reporte';

    async getEvaluacionPdf(evaluacionId: string): Promise<Blob> {
        const response: AxiosResponse<Blob> = await api.get(`${this.BASE_URL}/evaluacion/${evaluacionId}`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf',
            },
        });
        return response.data;
    }
}