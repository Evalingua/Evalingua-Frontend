import React from 'react';
import Breadcumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Tables/Table';
import Input from '../../components/Inputs/Input';
import Select from '../../components/Forms/SelectGroup/Select';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Textarea from '../../components/Inputs/TextArea';
import { useNavigate } from 'react-router-dom';

const Resultados: React.FC = () => {
  const navigate = useNavigate();

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

  const options = [
    { value: 'dni', label: 'DNI' },
    { value: 'nombre', label: 'Nombres' },
  ];

  const handleSearchClick = (value: any) => {
    console.log('Search value:', value);
    // Aquí puedes hacer la búsqueda, enviar el valor a una API, etc.
  };

  /* const ListPacientes = async () => {
    try {
      const response = await pacienteService.getAllPacientes();
      console.log('Pacientes:', response);
      paginationProps.totalItems = response.totalElements;
      paginationProps.totalPages = response.totalPages;
      paginationProps.currentPage = response.currentPage;
      paginationProps.pageSize = response.pageSize;
    } catch (error) {
      console.error('Error fetching pacientes:', error);
    }
    // Aquí puedes hacer la búsqueda, enviar el valor a una API, etc.
  }; */

  /* const SearchPacienteReniec = async (dni: string) => {
    try {
      const response = await reniecService.getPatientFromReniec(dni);
      console.log('Paciente Reniec:', response);
    } catch (error) {
      console.error('Error fetching paciente Reniec:', error);
    }
  }; */

  /* React.useEffect(() => {
    ListPacientes();
  }, []); */

  const paginationProps = {
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalItems: 10,
    onPageChange: (page: number) => console.log('Page:', page),
  };

  const columns = [
    { title: 'DNI', key: 'dni' },
    { title: 'Nombre del paciente', key: 'nombre' },
    { title: 'Edad', key: 'edad' },
    { title: 'Fecha de evaluación', key: 'fecha' },
    { title: 'N° de fonemas evaluados', key: 'n_fonemas' },
    { title: 'Omisiones', key: 'omisiones' },
    { title: 'Sustituciones', key: 'sustituciones' },
    { title: 'Distorsiones', key: 'distorsiones' },
    { title: 'Logrados', key: 'logrados' },
    {
      title: 'Estado',
      key: 'estado',
      render: (item: any) => (
        <span
          className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
            item.estado === 'Generado'
              ? 'bg-success/10 text-success'
              : item.estado === 'Fallido'
              ? 'bg-danger/10 text-danger'
              : 'bg-warning/10 text-warning'
          }`}
        >
          {item.estado}
        </span>
      ),
    },
  ];

  const data = [
    {
        dni: '12345678',
        nombre: 'Paciente 1',
        edad: '3 años',
        fecha: '13/01/2023',
        n_fonemas: 5,
        omisiones: 1,
        sustituciones: 2,
        distorsiones: 1,
        logrados: 2,
        estado: 'Generado',
    },
    {
        dni: '123456',
        nombre: 'Paciente 2',
        edad: '4 años',
        fecha: '13/01/2023',
        n_fonemas: 5,
        omisiones: 1,
        sustituciones: 2,
        distorsiones: 1,
        logrados: 2,
        estado: 'Pendiente',
    },
    {
        dni: '123456',
        nombre: 'Paciente 3',
        edad: '5 años',
        fecha: '13/01/2023',
        n_fonemas: 5,
        omisiones: 1,
        sustituciones: 2,
        distorsiones: 1,
        logrados: 2,
        estado: 'Fallido',
    },
    {
        dni: '123456',
        nombre: 'Paciente 4',
        edad: '6 años',
        fecha: '13/01/2023',
        n_fonemas: 5,
        omisiones: 1,
        sustituciones: 2,
        distorsiones: 1,
        logrados: 2,
        estado: 'Generado',
    }
  ];

  const actions = [
    {
      label: 'View',
      onClick: (item: any) => {
        setShowPacienteModal(true);
      },
    },
    {
      label: 'Download',
      onClick: () => {
        setShowDeleteModal(true);
      },
    },
    { label: 'Delete', onClick: (item: any) => console.log('Delete', item) },
  ];

  return (
    <>
      <Breadcumb pageName="Resultados de Evaluación"></Breadcumb>
      <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="flex items-end justify-between">
          <div className="flex gap-3 items-end">
            <Select
              options={options}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
            />
            <Input
              placeholder="Buscar pacientes"
              isSearch
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearchClick={handleSearchClick}
            />
            <Input
              label="Fecha de evaluación"
              placeholder="dd/mm/yyyy"
              type="date"
              onChange={(e) => setSearch(e.target.value)}
            />
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
                  onClick={() => setShowPacienteModal(false)}
                  className="rounded-lg bg-primary px-6 py-2 text-white"
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
                  isSearch
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
                <Input
                  type="date"
                  label="Fecha de nacimiento"
                  placeholder="Fecha de nacimiento"
                  value={pacienteModal.fechaNacimiento}
                  classSize="col-span-2"
                  onChange={(e) =>
                    setPacienteModal({
                      ...pacienteModal,
                      fechaNacimiento: e.target.value,
                    })
                  }
                />
                <Input
                  label="Edad"
                  placeholder="Edad"
                  value=""
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
                  onClick={() => setShowDeleteModal(false)}
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
          data={data}
          actions={actions}
          paginationEnabled
          paginationProps={paginationProps}
        />
      </div>
    </>
  );
};

export default Resultados;
