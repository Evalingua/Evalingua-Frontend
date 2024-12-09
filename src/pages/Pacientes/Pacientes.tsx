import React, { useState } from 'react';
import Breadcumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Tables/Table';
import Input from '../../components/Inputs/Input';
import Select from '../../components/Forms/SelectGroup/Select';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { PacienteService } from './services/pacienteService';
import { ReniecService } from './services/reniecService';
import Textarea from '../../components/Inputs/TextArea';
import { Link, useNavigate } from 'react-router-dom';
import { PacienteRequest, PacienteResponse } from '../../types/paciente';
import CryptoJS from 'crypto-js';

const Pacientes: React.FC = () => {
  const pacienteService = new PacienteService();
  const reniecService = new ReniecService();
  const navigate = useNavigate();
  const auth = localStorage.getItem('auth') || '{}';

  const [pacientesList, setPacientesList] = React.useState<PacienteResponse[]>(
    [],
  );
  const [search, setSearch] = React.useState<string>('');
  const [pacienteModal, setPacienteModal] = React.useState({
    dni: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    edad: 0,
    sexo: '',
    observaciones: '',
  });
  const [selectedOption, setSelectedOption] = React.useState<string>('dni');
  const [showPacienteModal, setShowPacienteModal] =
    React.useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [paginationProps, setPaginationProps] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 10,
    onPageChange: (page: number) => console.log('Page:', page),
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
        setShowPacienteModal(true);
        pacienteService.getPacienteByDni(item.dni).then((response) => {
          setPacienteModal({
            dni: response.content[0].dni.toString(),
            nombre: response.content[0].nombre,
            apellidoPaterno: response.content[0].apellidoPaterno,
            apellidoMaterno: response.content[0].apellidoMaterno,
            fechaNacimiento: response.content[0].fechaNacimiento,
            edad: response.content[0].edad,
            sexo: response.content[0].sexo,
            observaciones: response.content[0].observaciones,
          });
        });
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
      navigate(`/paciente/detalle/${encrypt(item.dni.toString())}`);
    } },
    {
      label: 'Evaluation',
      onClick: () => {
        navigate(`/configuracion`);
      },
    },
  ];

  const handleSearchClick = (value: any) => {
    if (value === '') {
      ListPacientes();
    } else if (selectedOption === 'dni') {
      pacienteService.getPacienteByDni(parseInt(value)).then((response) => {
        setPacientesList(response.content);
        setPaginationProps({
          currentPage: response.currentPage + 1,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
          totalItems: response.totalElements,
          onPageChange: (page: number) => console.log('Page:', page),
        });
      });
    } else {
      pacienteService.getPacienteByNombre(value).then((response) => {
        setPacientesList(response.content);
        setPaginationProps({
          currentPage: response.currentPage + 1,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
          totalItems: response.totalElements,
          onPageChange: (page: number) => console.log('Page:', page),
        });
      });
    }
  };

  const ListPacientes = async () => {
    try {
      const response = await pacienteService.getAllPacientes();
      console.log('Pacientes:', response);
      setPaginationProps({
        currentPage: response.currentPage + 1,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        totalItems: response.totalElements,
        onPageChange: (page: number) => console.log('Page:', page),
      });
      setPacientesList(response.content);
    } catch (error) {
      console.error('Error fetching pacientes:', error);
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
        fechaNacimiento: pacienteModal.fechaNacimiento,
        sexo: pacienteModal.sexo,
        observaciones: pacienteModal.observaciones,
        usuarioRegistro: JSON.parse(auth).data.username,
      };
      const response = await pacienteService.createPaciente(newPaciente);
      console.log('Paciente creado:', response);
      if (response.data) {
        setShowPacienteModal(false);
        ListPacientes();
      }
    } catch (error) {
      console.error('Error creando paciente:', error);
    }
  };

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

  const SearchPacienteReniec = async (dni: string) => {
    try {
      const response = await reniecService.getPatientFromReniec(dni);
      console.log('Paciente Reniec:', response);
    } catch (error) {
      console.error('Error fetching paciente Reniec:', error);
    }
  };

  const calculateAge = (fecha: Date) => {
    var hoy = new Date();
    var edad = hoy.getFullYear() - fecha.getFullYear();
    var m = hoy.getMonth() - fecha.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }

    return edad;
  };

  const encrypt = (text: string) => {
    return CryptoJS.HmacSHA256(
      text,
      '97b0c102abf5ab361b05124d6fcc2c9862d897f9472670bc343cea1491dc945b',
    ).toString();
  }

  React.useEffect(() => {
    ListPacientes();
  }, []);

  return (
    <>
      <Breadcumb pageName="Pacientes"></Breadcumb>
      <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Select
              options={options}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
            />
            {selectedOption === 'dni' ? (
              <Input
                placeholder="Buscar pacientes"
                isSearch
                value={search}
                classSize="w-96"
                type="number"
                onChange={(e) => setSearch(e.target.value)}
                onSearchClick={handleSearchClick}
              />
            ) : (
              <Input
                placeholder="Buscar pacientes"
                isSearch
                value={search}
                classSize="w-96"
                onChange={(e) => setSearch(e.target.value)}
                onSearchClick={handleSearchClick}
              />
            )}
          </div>
          <Button
            text="Agregar paciente"
            onClick={() => {
              setShowPacienteModal(true);
              setPacienteModal({
                dni: '',
                nombre: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                fechaNacimiento: '',
                edad: 0,
                sexo: '',
                observaciones: '',
              });
            }}
            backgroundColor="#3C50E0"
          />
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
                    pacienteModal.fechaNacimiento === '' ||
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
                  isSearch
                  onChange={(e) =>
                    setPacienteModal({ ...pacienteModal, dni: e.target.value })
                  }
                  onSearchClick={(value: string) => SearchPacienteReniec(value)}
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
                <Input
                  type="date"
                  label="Fecha de nacimiento"
                  placeholder="Fecha de nacimiento"
                  value={pacienteModal.fechaNacimiento}
                  classSize="col-span-2"
                  onChange={(e) => {
                    setPacienteModal({
                      ...pacienteModal,
                      fechaNacimiento: e.target.value,
                      edad: calculateAge(
                        new Date(pacienteModal.fechaNacimiento),
                      ),
                    });
                  }}
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
        />
      </div>
    </>
  );
};

export default Pacientes;
