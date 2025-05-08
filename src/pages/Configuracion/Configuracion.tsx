import React from 'react'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import Input from '../../components/Inputs/Input'
import MultiSelect from '../../components/Forms/SelectGroup/MultiSelect'
import { useNavigate, useParams } from 'react-router-dom'
import { configs } from './configs'
import { PacienteService } from '../../services/paciente/PacienteService'
import { PacienteResponse } from '../../types/paciente'
import { ConfigRequest, TipoConfiguracion } from '../../types/config.type'
import Modal from '../../components/Modal'
import QRCode from "react-qr-code";
import { NewEvaluacionRequest, NewEvaluacionResponse } from '../../types/evaluacion.type'
import { EvaluacionService } from '../../services/evaluacion/EvaluacionService'
import { decrypt } from '../../common/Crypto/crypto'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { useNotifications, NotificationDTO } from '../../hooks/useNotifications'

const Configuracion: React.FC = () => {
  const navigate = useNavigate();
  const pacienteService = new PacienteService();
  const evaluacionService = new EvaluacionService();
  //const gameConfigService = new GameConfigService();
  const { user } = useAuth();
  const [paciente, setPaciente] = React.useState<PacienteResponse>();
  const [evaluacion, setEvaluacion] = React.useState<NewEvaluacionResponse>();
  const [tipoConfiguracion, setTipoConfiguracion] = React.useState<TipoConfiguracion>(configs[0]);
  const [selectedValues, setSelectedValues] = React.useState<ConfigRequest[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
  const [qrScanned, setQrScanned] = React.useState<boolean>(false);
  let { idEncriptado } = useParams();
  const baseUrl = import.meta.env.VITE_API_GAME_URL;

  // Manejador para notificaciones privadas
  const handlePrivateNotification = React.useCallback((notification: NotificationDTO) => {
    console.log("Notificación recibida:", notification);
    
    // Verificar si es una notificación de escaneo de QR para esta evaluación
    if (notification.type === 'scan' && notification.content === 'La evaluación ha comenzado') {
      setQrScanned(true);
      toast('¡El código QR ha sido escaneado correctamente!', { type: 'success' });
    }
  }, []);

  // Configurar el hook de notificaciones
  useNotifications({
    userId: user?.username || '',
    onPrivateNotification: handlePrivateNotification
  });

  React.useEffect(() => {
    const dniPaciente = decrypt(idEncriptado ?? '');
    pacienteService.getPacienteByDni(dniPaciente).then((response) => {
      setPaciente(response.data);
      switch(response.data.edad) {
        case 3:
          setTipoConfiguracion(configs[0]);
          break;
        case 4:
          setTipoConfiguracion(configs[1]);
          break;
        default:
          setTipoConfiguracion(configs[2]);
      }
    });
  }, []);

  React.useEffect(() => {
    if (tipoConfiguracion) {
      const initialValues: ConfigRequest[] = tipoConfiguracion.valores.map(config => ({
        segmento: config.keyname,
        fonemas: config.fonemas.filter(fonema => fonema.selected).map(fonema => fonema.value)
      }));

      setSelectedValues(initialValues);
    }
  }, [tipoConfiguracion]);

  const handleSelectionChange = (selected: string[], segmento: string) => {
    // Encuentra la configuración original de este segmento
    const configGroup = tipoConfiguracion?.valores.find(c => c.keyname === segmento);
    if (!configGroup) return;

    const allValues = configGroup.fonemas.map(f => f.value);

    const updatedSelectedValues = selectedValues.map(config => {
      if (config.segmento === segmento) {
        // Si selected está vacío: quitar todos
        // Si selected abarca todo allValues: seleccionar todos
        // En otros casos, respetar exactamente selected
        let newFonemas: string[];
        if (selected.length === 0) {
          newFonemas = [];
        } else if (selected.length === allValues.length &&
                  allValues.every(v => selected.includes(v))) {
          newFonemas = [...allValues];
        } else {
          newFonemas = [...selected];
        }
        return { ...config, fonemas: newFonemas };
      }
      return config;
    });
    
    setSelectedValues(updatedSelectedValues);
  };

  const createEvaluacion = () => {
    if (selectedValues.length <= 0) {
      toast('Debe seleccionar al menos un fonema', { type: 'error' });
      return;
    }

    const totalFonemasSeleccionados = selectedValues.reduce(
      (acc, curr) => acc + curr.fonemas.length,
      0
    );

    const request: NewEvaluacionRequest = {
      username: user?.username || '',
      dniPaciente: paciente?.dni || '',
      numResultados: totalFonemasSeleccionados,
    };
    evaluacionService.createEvaluacion(request).then((response) => {
      if (response.status_code !== 201) {
        toast('Error al crear la evaluación', { type: 'error' });
        return;
      }
      setEvaluacion(response.data);
      setShowModal(true);
      // Resetear el estado del escaneo cuando se crea una nueva evaluación
      setQrScanned(false);
      toast('Evaluación creada correctamente', { type: 'success' });
    });
  }
  
  const createGameConfig = () => {
    const filteredSettings = selectedValues.filter(config => config.fonemas.length > 0);

    const request = {
      idEvaluacion: evaluacion?.id || '',
      settings: filteredSettings,
    };
    
    return request;
  }

  const handleCloseModal = () => {
    // Solo permitir cerrar si el QR ha sido escaneado
    if (qrScanned) {
      setSelectedValues([]);
      navigate(`/pacientes`);
    } else {
      toast('Por favor espere a que el código QR sea escaneado antes de continuar', { type: 'warning' });
    }
  };

  const handleCancelEvaluation = () => {
    // Implementación de cancelación de evaluación
    if (evaluacion?.id) {
      evaluacionService.anularEvaluacion(evaluacion.id)
        .then(() => {
          toast('Evaluación cancelada correctamente', { type: 'info' });
          navigate(`/pacientes`);
        })
        .catch(() => {
          toast('Error al cancelar la evaluación', { type: 'error' });
        });
    } else {
      navigate(`/pacientes`);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Configuración de la evaluación" back/>
      <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 justify-between">
            <div className="flex gap-3">
              <Input
                label="DNI del paciente"
                disabled
                value={paciente?.dni}
                classSize="w-35"
              />
              <Input
                label="Nombre del paciente"
                disabled
                value={paciente?.nombreCompleto}
                classSize="w-80"
              />
              <Input label="Edad" disabled value={paciente?.edad.toString()} classSize="w-25" />
            </div>
            <div className="flex gap-3 items-end">
              <button
                onClick={() => {
                    setShowConfirmModal(true);
                }}
                className="rounded-lg bg-primary px-10 py-2 h-fit text-white cursor-pointer"
              >
                Crear evaluación
              </button>
            </div>
          </div>
          <div className='flex gap-3 flex-col'>
            <h2 className='font-bold text-lg text-boxdark-2 dark:text-slate-200'>Configuración de fonemas</h2>
            <div className="grid grid-cols-2 gap-5">
              {
                tipoConfiguracion?.valores.map((config) => {
                  return (
                    <MultiSelect
                      key={config.id}
                      options={config.fonemas}
                      label={config.segmento}
                      onSelectionChange={(selected) => {
                        console.log('selected', selected);
                        handleSelectionChange(selected, config.keyname)
                      }}
                    />
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        closeOnClickOutside={false}
        size="xl"
        title="Iniciar evaluación"
        footer={
          <div className="flex justify-end gap-3 w-full">
            {!qrScanned ? (
              <>
                <div className="flex items-center pr-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-boxdark-2 dark:text-slate-300">Esperando escaneo del QR...</span>
                </div>
                <button
                  onClick={handleCancelEvaluation}
                  className="rounded-lg border border-danger px-6 py-2 text-danger"
                >
                  Cancelar evaluación
                </button>
              </>
            ) : (
              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
              >
                Aceptar
              </button>
            )}
          </div>
        }
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className='h-auto m-[0_auto] max-w-[256px] w-full'>
            <QRCode
              size={128}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={JSON.stringify(createGameConfig())}
              viewBox={`0 0 256 256`}
            />
          </div>
          <div
            className="inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-stroke dark:bg-strokedark"></div>
          <div className='flex flex-col gap-3'>
            <p className='text-boxdark-2 dark:text-slate-200 text-lg font-bold text-wrap'>Escanee el código QR para iniciar la evaluación</p>
            <p className='text-boxdark-2 dark:text-slate-200 text-lg font-bold text-wrap'> O diríjase a esta página <a href={`${baseUrl}/?code=${evaluacion?.id}`} target="_blank" className='text-primary'>game.evalingua.com</a> </p>
            {qrScanned && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ¡QR escaneado correctamente! Ya puede continuar.
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        closeOnClickOutside={false}
        size="md"
        title="Confirmar creación de evaluación"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                createEvaluacion();
              }}
              className="rounded-lg bg-primary px-6 py-2 text-white"
            >
              Aceptar
            </button>
          </div>
        }
      >
        <div className='font-medium text-lg text-boxdark-2 dark:text-slate-200'>
          <p>¿Estas seguro que deseas crear esta evaluación?</p>
        </div>
      </Modal>
    </>
  );
}

export default Configuracion