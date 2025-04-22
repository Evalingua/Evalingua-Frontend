import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Input from '../../components/Inputs/Input';
import { PacienteService } from '../../services/paciente/PacienteService';
import { PacienteResponse } from '../../types/paciente';
import { decrypt } from '../../common/Crypto/crypto';
import { useParams } from 'react-router-dom';
import TextArea from '../../components/Inputs/TextArea';
import { EvaluacionService } from '../../services/evaluacion/EvaluacionService';
import { UltimosResultados } from '../../types/evaluacion.type';
import Table from '../../components/Tables/Table';
import { toast } from 'react-toastify';
import { EstadisticaService } from '../../services/estadisticas/EstadisticaService';
import ChartArea from '../../components/Charts/ChartArea';

const PacienteDetalle: React.FC = () => {
    const pacienteService = new PacienteService();
    const evaluacionService = new EvaluacionService();
    const estadisticaService = new EstadisticaService();
    const [paciente, setPaciente] = React.useState<PacienteResponse>();
    const [ultimosResultados, setUltimosResultados] = React.useState<UltimosResultados[]>();
    const [evolucionPaciente, setEvolucionPaciente] = React.useState<any>();
    const { idEncriptado } = useParams();

    React.useEffect(() => {
        const dniPaciente = decrypt(idEncriptado ?? '');
        pacienteService.getPacienteByDni(dniPaciente).then((response) => {
          setPaciente(response.data);
          if (response.status_code !== 200) {
            toast(`Warning: ${response.message}`, { type: 'warning', autoClose: 3000 });
            console.error('Error al obtener el paciente:', response.message);
          }
        });
        evaluacionService.getUltimosResultados(dniPaciente).then((response) => {
            const data = response.data.map((item) => {
                item.porcentajeAciertos = `${(parseFloat(item.porcentajeAciertos)).toFixed(2)}%`;
                return item;
            });
            setUltimosResultados(data);
            if (response.status_code !== 200) {
                toast(`Warning: ${response.message}`, { type: 'warning', autoClose: 3000 });
                console.error('Error al obtener el paciente:', response.message);
            }
        });
        estadisticaService.getEstadisticasEvolucionPaciente(dniPaciente).then((response) => {
            setEvolucionPaciente(response.data);
            if (response.status_code !== 200) {
                toast(`Warning: ${response.message}`, { type: 'warning', autoClose: 3000 });
                console.error('Error al obtener el paciente:', response.message);
            }
        });
      }, []);

    return (
        <>
            <Breadcrumb pageName="Detalles del paciente" back/>
            <section className='grid grid-cols-12 gap-4'>
                <section className="flex flex-col col-span-4 gap-5 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <div className='flex w-full gap-5'>
                        <Input
                            disabled
                            label='DNI'
                            value={paciente?.dni}
                            classSize='w-40'
                        />
                        <Input
                            disabled
                            label='Nombres'
                            value={paciente?.nombre}
                            classSize='w-full'
                        />
                    </div>
                    <div className='flex w-full gap-5'>
                        <Input
                            disabled
                            label='Apellido Paterno'
                            value={paciente?.apellidoPaterno}
                            classSize='w-full'
                        />
                        <Input
                            disabled
                            label='Apellido Materno'
                            value={paciente?.apellidoMaterno}
                            classSize='w-full'
                        />
                    </div>
                    <div className='flex w-full gap-5'>
                        <Input
                            disabled
                            label='Fecha de nacimiento'
                            value={paciente?.fechaNacimiento}
                            classSize='w-full'
                        />
                        <Input
                            disabled
                            label='Edad'
                            value={paciente?.edad.toString()}
                            classSize='w-full'
                        />
                    </div>
                    <div className='flex w-full gap-5'>
                        <Input
                            disabled
                            label='Sexo'
                            value={paciente?.sexo}
                            classSize='w-1/2'
                        />
                    </div>
                    <div className='flex w-full'>
                        <TextArea
                            label="Observaciones"
                            placeholder="No hay observaciones"
                            rows={3}
                            value={paciente?.observaciones}
                            disabled
                            classSize='w-full'
                        />
                    </div>
                </section>
                <section className="flex flex-col col-span-8 gap-5 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <ChartArea
                        title="Evolución del paciente"
                        categories={evolucionPaciente?.categories ?? []}
                        seriesData={evolucionPaciente?.seriesData ?? []}
                        legendPosition="top"
                        height={200}
                        max_value={80}
                    />
                    <Table
                        columns={[
                            {title: 'Fonemas evaluados', key: 'totalFonemas'},
                            {title: 'Nivel de alteración', key: 'nivelAlteracion'},
                            {title: 'Porcentaje de aciertos', key: 'porcentajeAciertos'},
                        ]}
                        data={ultimosResultados ?? []}
                    />
                </section>
            </section>
        </>
    )
}

export default PacienteDetalle;