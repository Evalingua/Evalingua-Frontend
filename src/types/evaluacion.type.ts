export interface NewEvaluacionRequest {
    username: string;
    dniPaciente: string;
    numResultados: number;
}

export interface NewEvaluacionResponse {
    id: string;
    usuario: string;
    dniPaciente: string;
    fechaEvalucion: string;
}

export interface ListEvaluacionRequest {
    page: number;
    size: number;
    username?: string;
    dniPaciente?: string;
    nombrePaciente?: string;
    estadoRegistro: boolean;
    estadoEvaluacion?: string;
    fechaEvaluacionInicio?: string;
    fechaEvaluacionFin?: string;
}

export interface ListEvaluacionResponse {
    id: string;
    usuario: string;
    dniPaciente: string;
    nombrePaciente: string;
    edadPaciente: number;
    numResultados: number;
    fechaEvaluacion: string;
    estadoEvaluacion: string;
}

export interface ProximaEvaluacionResponse {
    pacienteId: number;
    paciente: string;
    ultimaEvaluacion: string;
    proximaEvaluacion: string;
    diasRestantes: number;
}

export interface UltimosResultados {
    totalFonemas: number;
    nivelAlteracion: string
    porcentajeAciertos: string;
}