import { AxiosResponse } from "axios";
import { BaseResponse } from "../../types/page";
import api from "../../interceptors/axiosConfig";
import { ListResultadoDetalleResponse, ResultadoDetalleTrastorno, ResultadoDTOResponse } from "../../types/resultado.type";

export class ResultadoDetalleService {
    private readonly BASE_URL = '/resultado-detalle';

    async getResultadosDetalle(resultadoId: number): Promise<BaseResponse<ListResultadoDetalleResponse[]>> {
        const response: AxiosResponse<BaseResponse<ListResultadoDetalleResponse[]>> = await api.get(`${this.BASE_URL}/listar/${resultadoId}`);
        return response.data;
    }

    async seTrastorno(request: ResultadoDetalleTrastorno): Promise<BaseResponse<ResultadoDTOResponse>> {
        const response: AxiosResponse<BaseResponse<ResultadoDTOResponse>> = await api.post(`${this.BASE_URL}/set-trastorno`, request);  
        return response.data;
    }
}