export interface UsuarioDTO {
    username: string;
    nombre: string;
    email: string;
    celular: string;
    estadoRegistro: boolean;
    rol: string;
}

export interface ListUsuarioRequest {
    page: number;
    size: number;
    username?: string;
    nombre?: string;
    estadoRegistro?: boolean;
    rol?: string;
}

export interface UpdateUsuarioRequest {
    nombre: string;
    email: string;
    celular: string;
    rol: string;
}

export interface ChangePasswordRequest {
    username: string;
    newPassword: string;
}

export interface NewUsuarioRequest {
    username: string;
    password: string;
    nombre: string;
    email: string;
    celular: string;
    rol: string;
}