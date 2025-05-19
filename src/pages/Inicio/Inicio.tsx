import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Tables/Table';
import ChartArea from '../../components/Charts/ChartArea';
import { EvaluacionService } from '../../services/evaluacion/EvaluacionService';
import { ProximaEvaluacionResponse } from '../../types/evaluacion.type';
import { toast } from 'react-toastify';
import { EstadisticaService } from '../../services/estadisticas/EstadisticaService';
import { GraficoDTO } from '../../types/estadistica.type';
import Modal from '../../components/Modal';
import Input from '../../components/Inputs/Input';
import { differenceInYears, format } from 'date-fns';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import TextArea from '../../components/Inputs/TextArea';
import Select from '../../components/Forms/SelectGroup/Select';
import { PacienteRequest } from '../../types/paciente';
import { PacienteService } from '../../services/paciente/PacienteService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Inicio: React.FC = () => {
  const evaluacionService = new EvaluacionService();
  const estadisticaService = new EstadisticaService();
  const pacienteService = new PacienteService();
  const navigate = useNavigate();
  const [proximasEvaluaciones, setProximasEvaluaciones] = React.useState<ProximaEvaluacionResponse[]>([]);
  const [graficoGlobal, setGraficoGlobal] = React.useState<GraficoDTO>();
  const [showPacienteModal, setShowPacienteModal] = React.useState<boolean>(false);
  const [loadingTable, setLoadingTable] = React.useState<boolean>(true);
  const [loadingResultados, setLoadingResultados] = React.useState<boolean>(true);
  const [pacienteModal, setPacienteModal] = React.useState({
    dni: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: new Date(),
    edad: 0,
    sexo: '',
    observaciones: ''
  });
  const {user} = useAuth();

  const addPaciente = async () => {
    console.log('Paciente:', pacienteModal);
    try {
      let newPaciente: PacienteRequest = {
        dni: parseInt(pacienteModal.dni),
        nombre: pacienteModal.nombre,
        apellidoPaterno: pacienteModal.apellidoPaterno,
        apellidoMaterno: pacienteModal.apellidoMaterno,
        fechaNacimiento: format(new Date(pacienteModal.fechaNacimiento), 'yyyy-MM-dd'),
        sexo: pacienteModal.sexo,
        observaciones: pacienteModal.observaciones,
        usuarioRegistro: user?.username ?? '',
      };
      const response = await pacienteService.createPaciente(newPaciente).then((res) => {
        if (res.status_code !== 201) {
          toast(`Error al crear paciente: ${res.message}`, { type: 'error', autoClose: 3000 });
        } else {
          toast('Paciente creado correctamente', { type: 'success', autoClose: 3000 });
        }
        return res;
      });
      console.log('Paciente creado:', response);
      if (response.data) {
        setShowPacienteModal(false);
      }
    } catch (error) {
      console.error('Error creando paciente:', error);
    }
  };

  const ListProximasEvaluaciones = async () => {
    try {
      const response = await evaluacionService.getProximasEvaluaciones();
      if (response.status_code === 200) {
        setProximasEvaluaciones(response.data);
        setLoadingTable(false);
      } else {
        toast(`Error: ${response.message}`, { type: 'error', autoClose: 3000 });
      }
    } catch (error) {
      toast(`Error: ${error}`, { type: 'error', autoClose: 3000 });
    }
  }

  const ListEstadisticasGlobales = async () => {
    try {
      const response = await estadisticaService.getEstadisticasGlobales();
      if (response.status_code === 200) {
        setGraficoGlobal(response.data);
        setLoadingResultados(false);
      } else {
        toast(`Error: ${response.message}`, { type: 'error', autoClose: 3000 });
      }
    } catch (error) {
      toast(`Error: ${error}`, { type: 'error', autoClose: 3000 });
    }
  }

  React.useEffect(() => {
    ListProximasEvaluaciones();
    ListEstadisticasGlobales();
  }, []);

  const columns = [
      {title: 'Nombre del paciente', key: 'paciente'},
      {title: 'Última evaluación', key: 'ultimaEvaluacion'},
      {title: 'Proxima evaluación', key: 'proximaEvaluacion'},
      {title: 'Dias restantes', key: 'diasRestantes'},
  ]

  return (
    <>
      <Breadcrumb pageName="Inicio"></Breadcrumb>

      <div className="mt-4 h-full grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="flex flex-wrap items-center justify-between gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-18">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg text-black dark:text-white">Bienvenido a Evalingua {user?.username}</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Evalingua, la plataforma de evaluación fonética-fonológica.
            </span>
          </div>
          <div className='flex flex-row md:w-auto w-full gap-3'>
            <button 
              className="bg-sky_slate/40 dark:bg-sky_slate/30 p-2 md:p-5 w-full md:w-fit rounded-lg flex flex-col md:flex-row items-center gap-2"
              onClick={() => setShowPacienteModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 9h-4V7h-2v4H7v2h4v4h2v-4h4z"/></svg>
              <h3 className="text-slate_blue font-bold dark:text-slate-200">
                Agregar paciente
              </h3>
            </button>
            <button 
            className="bg-sky_slate/40 dark:bg-sky_slate/30 p-2 md:p-5 w-full md:w-fit rounded-lg flex flex-col md:flex-row items-center gap-2"
            onClick={() => navigate('/tutoriales')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M21 3H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M1 18v3h3a3 3 0 0 0-3-3m0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7m0-4v2a9 9 0 0 1 9 9h2c0-6.08-4.93-11-11-11m10 1.09v2L14.5 15l3.5-1.91v-2L14.5 13zM14.5 6L9 9l5.5 3L20 9z"/></svg>
            <h3 className="text-slate_blue font-bold dark:text-slate-200">
              Ver tutoriales
            </h3>
          </button>
          </div>
        </div>
        <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
          <h2 className="font-bold text-lg">Proximas evaluaciones</h2>
          <Table columns={columns} data={proximasEvaluaciones} loading={loadingTable}/>
        </div>
        <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
          <ChartArea
            title="Resultados Generales de evaluaciones"
            categories={graficoGlobal?.categories || []}
            seriesData={graficoGlobal?.seriesData || []}
            legendPosition="top"
            height={300}
            max_value={80}
            loading={loadingResultados}
          />
        </div>
      </div>
      <Modal
        isOpen={showPacienteModal}
        onClose={() => setShowPacienteModal(false)}
        closeOnClickOutside={false}
        size="xl"
        title="Agregar paciente"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowPacienteModal(false)}
              className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
            >
              Cerrar
            </button>
            <button
              onClick={() => addPaciente()}
              className="rounded-lg bg-primary px-6 py-2 text-white disabled:opacity-50"
              disabled={
                pacienteModal.dni === '' ||
                pacienteModal.nombre === '' ||
                pacienteModal.apellidoPaterno === '' ||
                pacienteModal.apellidoMaterno === '' ||
                pacienteModal.fechaNacimiento === new Date() ||
                pacienteModal.sexo === ''
              }
            >
              Guardar
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2 w-full">
            <Input
              label="DNI"
              placeholder="DNI"
              value={pacienteModal.dni}
              maxLength={8}
              onChange={(e) =>
                setPacienteModal({ ...pacienteModal, dni: e.target.value })
              }
            />
            <Input
              label="Nombre"
              placeholder="Nombre"
              classSize="col-span-3"
              value={pacienteModal.nombre}
              onChange={(e) =>
                setPacienteModal({
                  ...pacienteModal,
                  nombre: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Input
              label="Apellido Paterno"
              placeholder="Apellido Paterno"
              value={pacienteModal.apellidoPaterno}
              classSize="col-span-2"
              onChange={(e) =>
                setPacienteModal({
                  ...pacienteModal,
                  apellidoPaterno: e.target.value,
                })
              }
            />
            <Input
              label="Apellido Materno"
              placeholder="Apellido Materno"
              value={pacienteModal.apellidoMaterno}
              classSize="col-span-2"
              onChange={(e) =>
                setPacienteModal({
                  ...pacienteModal,
                  apellidoMaterno: e.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <DatePicker
              label='Fecha de nacimiento'
              placeholder='dd/mm/yyyy'
              onChange={(date) => {
                setPacienteModal({
                  ...pacienteModal,
                  fechaNacimiento: date[0],
                  edad: differenceInYears(new Date(), date[0])
                })
              }}
              mode='single'
              dateFormat='d/m/Y'
              className='col-span-2'
              inputClassName='w-full'
              monthSelectorType='dropdown'
              defaultDate={pacienteModal.fechaNacimiento}
            />
            <Input
              label="Edad"
              placeholder="Edad"
              value={pacienteModal.edad.toString()}
              classSize="col-span-2"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>

          <Select
            label="Sexo"
            options={[
              { value: 'MASCULINO', label: 'Masculino' },
              { value: 'FEMENINO', label: 'Femenino' },
            ]}
            placeholder="Seleccione una opción"
            value={pacienteModal.sexo}
            onChange={(value) =>
              setPacienteModal({ ...pacienteModal, sexo: value })
            }
          />
          <TextArea
            label="Observaciones"
            placeholder="Observaciones"
            rows={3}
            value={pacienteModal.observaciones}
            onChange={(e) =>
              setPacienteModal({
                ...pacienteModal,
                observaciones: e.target.value,
              })
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default Inicio;
