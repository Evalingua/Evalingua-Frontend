import { AxiosResponse } from "axios";
import api from "../../interceptors/axiosConfig";
import { BasePageResponse, BaseResponse } from "../../types/page";
import { ChangePasswordRequest, ListUsuarioRequest, NewUsuarioRequest, UpdateUsuarioRequest, UsuarioDTO } from "../../types/usuario.type";

export class UsuarioService {
    private readonly BASE_URL = '/usuario';

    async getUsuarios(request: ListUsuarioRequest): Promise<BasePageResponse<UsuarioDTO>> {
        const response: AxiosResponse<BasePageResponse<UsuarioDTO>> = await api.post(`${this.BASE_URL}/listar`, request);
        return response.data;
    }

    async createUsuario(request: NewUsuarioRequest): Promise<BaseResponse<UsuarioDTO>> {
        const response: AxiosResponse<BaseResponse<UsuarioDTO>> = await api.post(`auth/signup`, request);
        return response.data;
    }

    async getUsuarioByUsername(username: string): Promise<BaseResponse<UsuarioDTO>> {
        const response: AxiosResponse<BaseResponse<UsuarioDTO>> = await api.get(`${this.BASE_URL}/${username}`);
        return response.data;
    }

    async changePassword(request: ChangePasswordRequest): Promise<BaseResponse<UsuarioDTO>> {
        const response: AxiosResponse<BaseResponse<UsuarioDTO>> = await api.put(`${this.BASE_URL}/change-password`, request);
        return response.data;
    }

    async updateUsuario(username: string, request: UpdateUsuarioRequest): Promise<BaseResponse<UsuarioDTO>> {
        const response: AxiosResponse<BaseResponse<UsuarioDTO>> = await api.put(`${this.BASE_URL}/${username}`, request);
        return response.data;
    }

    async anularUsuario(username: string): Promise<BaseResponse<UsuarioDTO>> {
        const response: AxiosResponse<BaseResponse<UsuarioDTO>> = await api.post(`${this.BASE_URL}/anular/${username}`);
        return response.data;
    }

    async activarUsuario(username: string): Promise<BaseResponse<UsuarioDTO>> {
        const response: AxiosResponse<BaseResponse<UsuarioDTO>> = await api.post(`${this.BASE_URL}/activar/${username}`);
        return response.data;
    }
}