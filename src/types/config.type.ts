export interface TipoConfiguracion {
    id: number;
    nombre: string;
    edad: number;
    valores: {
        id: number;
        segmento: string;
        keyname: string;
        fonemas: {
            id: number;
            value: string;
            label: string;
            selected: boolean;
        }[];
    }[];
}

export interface ValorConfiguracion {
    segmento: string;
    fonemas: FonemaConfig[];
}

export interface FonemaConfig {
    value: string;
    text: string;
    active: boolean;
}

export interface ConfigRequest {
    segmento: string;
    fonemas: string[];
}

export interface GameConfigRequest {
    idEvaluacion: string;
    settings: ConfigRequest[];
}