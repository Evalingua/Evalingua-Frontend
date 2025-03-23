export interface PacienteResponse {
  dni: string;
  nombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  edad: number;
  sexo: string;
  observaciones: string;
  usuarioRegistro: string;
}

export interface ListarPacienteRequest {
  page?: number,
  size?: number,
  dni?: string,
  nombres?: string,
  usuarioRegistro?: string,
  estadoRegistro?: boolean
}

export interface PacienteRequest {
  dni: number;
  nombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  fechaNacimiento: string;
  sexo: string;
  observaciones: string;
  usuarioRegistro: string;
}
