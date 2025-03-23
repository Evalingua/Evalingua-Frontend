export interface NewEvaluacionRequest {
    username: string;
    dniPaciente: string;
}

export interface NewEvaluacionResponse {
    id: string;
    usuario: string;
    dniPaciente: string;
    fechaEvalucion: string;
}