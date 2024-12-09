export interface ReniecResponse {
   valid: boolean;
   message: string;
   details?: any;
   data: {
    success: boolean;
    numDocumento: string;
    nombreCompleto: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    codigoVerificacion: number;
    fechaNacimiento: string;
    sexo: string;
    estadoCivil: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    direccionCompleta: string;
    ubigeoReniec: string;
    ubigeoSunat: string;
    ubigeo: number[];
   };
   warning: boolean;
   intercept: boolean;
}