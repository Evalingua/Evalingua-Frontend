export interface NewResultadoRequest {
    evaluacionId: string;
    fonema: string;
    username: string;
    totalResultados: number;
}

export interface ResultadoDTOResponse {
    id: number;
    evaluacionId: string;
    fonemaId: number;
    fonema: string;
    alteracionId: string;
    alteracion: string;
    estadoRegistro: string;
    username: string;
    fechaCreacion: string;
}

export interface ListResultadoRequest {
    evaluacionId: string;
    page: number;
    size: number;
}

export interface ListResultadoDetalleResponse {
    id: number;
    palabra: string;
    posicion: number;
    trastorno: string;
    audioUrl: string;
}

export interface ResultadoDetalleTrastorno {
    resultadoDetalloId: number;
    trastorno: string;
}

export interface ResultadoDetalleDTOResponse {
    id: number;
    resultadoId: number;
    palabra: string;
    posicion: number;
    trastornoId: number;
    trastorno: string;
    audioId: number;
    audioPath: string;
    estadoRegistro: string;
    username: string;
    fechaCreacion: string;
}