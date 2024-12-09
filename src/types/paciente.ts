export interface PacienteResponse {
  dni: number;
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
