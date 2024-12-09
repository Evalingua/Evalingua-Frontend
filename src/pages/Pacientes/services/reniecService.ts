import axios from "axios";
import { ReniecResponse } from "../../../types/reniec";

const externalApi = axios.create({
  baseURL: 'https://apiuser.aviva.pe/api/v1/patient/getFromRENIEC',
});

export class ReniecService {
  async getPatientFromReniec(dni: string): Promise<ReniecResponse> {
    const response = await externalApi.get(`?documentNumber=${dni}`);
    return response.data;
  }
}