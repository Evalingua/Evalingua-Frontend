import React from 'react';
import Breadcumb from '../../components/Breadcrumbs/Breadcrumb';
import Table, { PaginationProps } from '../../components/Tables/Table';
import Input from '../../components/Inputs/Input';
import Select from '../../components/Forms/SelectGroup/Select';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { PacienteService } from '../../services/paciente/PacienteService';
import Textarea from '../../components/Inputs/TextArea';
import { useNavigate } from 'react-router-dom';
import { PacienteRequest, PacienteResponse, ListarPacienteRequest } from '../../types/paciente';
import { differenceInYears, format, parseISO } from 'date-fns';
import { encrypt } from '../../common/Crypto/crypto';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Pacientes: React.FC = () => {
  const pacienteService = new PacienteService();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [editMode, setEditMode] = React.useState(false);
  const [pacientesList, setPacientesList] = React.useState<PacienteResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string | undefined>('');
  const [pacienteModal, setPacienteModal] = React.useState({
    dni: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: new Date(),
    edad: 0,
    sexo: '',
    observaciones: '',
  });
  const [selectedOption, setSelectedOption] = React.useState<string>('dni');
  const [showPacienteModal, setShowPacienteModal] =
    React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [paginationProps, setPaginationProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
    onPageChange: (page: number) => handlePagination(page),
  });

  const options = [
    { value: 'dni', label: 'DNI' },
    { value: 'nombre', label: 'Nombres' },
  ];

  const columns = [
    { title: 'DNI', key: 'dni' },
    { title: 'Nombre del paciente', key: 'nombreCompleto' },
    { title: 'Edad', key: 'edad' },
    { title: 'Fecha Nacimiento', key: 'fechaNacimiento' },
    { title: 'Sexo', key: 'sexo' },
    { title: 'Usuario Registro', key: 'usuarioRegistro' },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (item: any) => {
        setEditMode(true);
        setShowPacienteModal(true);
        let paciente = pacientesList.find((paciente) => paciente.dni === item.dni);
        const fechaNacimiento = paciente?.fechaNacimiento ? parseISO(paciente.fechaNacimiento) : null;
        setPacienteModal({
          dni: paciente?.dni.toString() ?? '',
          nombre: paciente?.nombre ?? '',
          apellidoPaterno: paciente?.apellidoPaterno ?? '',
          apellidoMaterno: paciente?.apellidoMaterno ?? '',
          fechaNacimiento: fechaNacimiento ?? new Date(),
          edad: paciente?.edad ?? 0,
          sexo: paciente?.sexo ?? '',
          observaciones: paciente?.observaciones ?? '',
        });
        console.log('Paciente:', paciente);
      },
    },
    {
      label: 'Delete',
      onClick: (item: any) => {
        try {
          setShowDeleteModal(true);
          setPacienteModal({
            dni: item.dni.toString(),
            nombre: item.nombre,
            apellidoPaterno: item.apellidoPaterno,
            apellidoMaterno: item.apellidoMaterno,
            fechaNacimiento: item.fechaNacimiento,
            edad: item.edad,
            sexo: item.sexo,
            observaciones: item.observaciones,
          });
        } catch (error) {
          console.error('Error eliminando paciente:', error);
        }
      },
    },
    { label: 'View', onClick: (item: any) => {
      navigate(`/pacientes/detalle/${encrypt(item.dni.toString())}`);
    } },
    {
      label: 'Evaluation',
      onClick: (item: any) => {
        navigate(`/configuracion/${encrypt(item.dni.toString())}`);
      },
    },
  ];

  const handleSearchClick = (value: any) => {
    setLoading(true);
    setSearch(value);
    ListPacientes();
  };

  const handlePagination = (page: number) => {
    //console.log(paginationProps);
    console.log(page);
    setPaginationProps(prevProps => ({ ...prevProps, currentPage: page }));
  };

  React.useEffect(() => {
    ListPacientes();
    
  }, [paginationProps.currentPage]);

  const ListPacientes = async () => {
    setLoading(true);
    try {
      const request: ListarPacienteRequest = {
        page: paginationProps.currentPage - 1,
        size: paginationProps.pageSize,
        dni: selectedOption == "dni" ? search : undefined,
        nombres: selectedOption == "nombre" ? search : undefined,
        usuarioRegistro: user?.role != "ADMIN" ? user?.username : undefined,
        estadoRegistro: true
      }
      const response = await pacienteService.getAllPacientes(request)
      setPaginationProps(prevProps => ({
        ...prevProps,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalElements,
      }));
      setPacientesList(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pacientes:', error);
      toast(`Error al crear paciente: ${error}`, { type: 'error', autoClose: 3000 });
    }
  };

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
        ListPacientes();
      }
    } catch (error) {
      console.error('Error creando paciente:', error);
    }
  };

  const updatePaciente = async () => {
    console.log('Paciente:', pacienteModal);
    try {
      let updatedPaciente: PacienteRequest = {
        dni: parseInt(pacienteModal.dni),
        nombre: pacienteModal.nombre,
        apellidoPaterno: pacienteModal.apellidoPaterno,
        apellidoMaterno: pacienteModal.apellidoMaterno,
        fechaNacimiento: format(new Date(pacienteModal.fechaNacimiento), 'yyyy-MM-dd'),
        sexo: pacienteModal.sexo,
        observaciones: pacienteModal.observaciones,
        usuarioRegistro: user?.username ?? '',
      };
      const response = await pacienteService.updatePaciente(pacienteModal.dni, updatedPaciente).then((res) => {
        if (res.status_code !== 200) {
          toast(`Error al actualizar paciente: ${res.message}`, { type: 'error', autoClose: 3000 });
        } else {
          toast('Paciente actualizado correctamente', { type: 'success', autoClose: 3000 });
        }
        return res;
      });
      console.log('Paciente actualizado:', response);
      if (response.data) {
        setShowPacienteModal(false);
        setEditMode(false);
        ListPacientes();
      }
    } catch (error) {
      console.error('Error actualizando paciente:', error);
    }
  }

  const deletePaciente = async (dni: number) => {
    try {
      const response = await pacienteService.deletePaciente(dni);
      console.log('Paciente eliminado:', response);
      if (response.data == null) {
        setShowDeleteModal(false);
        ListPacientes();
      }
    } catch (error) {
      console.error('Error eliminando paciente:', error);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    ListPacientes();
  }

  return (
    <>
      <Breadcumb pageName="Pacientes"></Breadcumb>
      <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="flex flex-col md:flex-row justify-between">
          <form onSubmit={handleSubmit} className="flex w-full md:w-fit md:mb-0 mb-2 gap-3">
            <Select
              options={options}
              value={selectedOption}
              onChange={(value) => {setSelectedOption(value); setSearch('');}}
              className='w-48 md:w-32'
            />
            <Input
                placeholder="Buscar pacientes"
                isSearch
                value={search}
                classSize="w-96"
                type={selectedOption === 'dni' ? 'number' : 'text'}
                onChange={(e) => setSearch(e.target.value)}
                onSearchClick={(value) => handleSearchClick(value)}
              />
          </form>
          <Button
            text="Agregar paciente"
            onClick={() => {
              setShowPacienteModal(true);
              setPacienteModal({
                dni: '',
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                fechaNacimiento: new Date(),
                edad: 0,
                sexo: '',
                observaciones: '',
              });
            }}
            backgroundColor="#3C50E0"
            className='w-fit'
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="currentColor" d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16"/></svg>
            }
          />
          <Modal
            isOpen={showPacienteModal}
            onClose={() => setShowPacienteModal(false)}
            closeOnClickOutside={false}
            size="xl"
            title={editMode ? "Editar paciente" : "Agregar paciente"}
            footer={
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPacienteModal(false)}
                  className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => { editMode ? updatePaciente() : addPaciente() }}
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
                  {editMode ? "Actualizar" : "Guardar"}
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
              <Textarea
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
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            closeOnClickOutside={false}
            size="sm"
            title="Eliminar paciente"
            footer={
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    deletePaciente(parseInt(pacienteModal.dni));
                  }}
                  className="rounded-lg bg-primary px-6 py-2 text-white"
                >
                  Guardar
                </button>
              </div>
            }
          >
            <div>
              <p>¿Estas seguro que deseas anular este paciente?</p>
            </div>
          </Modal>
        </div>
        <Table
          columns={columns}
          data={pacientesList}
          actions={actions}
          paginationEnabled
          paginationProps={paginationProps}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Pacientes;
