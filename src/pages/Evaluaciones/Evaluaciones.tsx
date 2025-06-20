import React from 'react';
import Breadcumb from '../../components/Breadcrumbs/Breadcrumb';
import Table, { PaginationProps } from '../../components/Tables/Table';
import Input from '../../components/Inputs/Input';
import Select from '../../components/Forms/SelectGroup/Select';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import { EvaluacionService } from '../../services/evaluacion/EvaluacionService';
import { ListEvaluacionRequest, ListEvaluacionResponse } from '../../types/evaluacion.type';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { PdfViewerModal } from '../../components/PdfViewerModal';

const Evaluaciones: React.FC = () => {
  const navigate = useNavigate();
  const evaluacionService = new EvaluacionService();
  const [evaluacionSelected, setEvaluacionSelected] = React.useState<ListEvaluacionResponse>({} as ListEvaluacionResponse);
  const [search, setSearch] = React.useState<string>('');
  const [selectedOption, setSelectedOption] = React.useState<string>('dni');
  const [selectedOptionEstado, setSelectedOptionEstado] = React.useState<string>('TODOS');
  const [selectedOptionFecha, setSelectedOptionFecha] = React.useState<Date[]>(() => {
  const fechaFinal = new Date();
    fechaFinal.setHours(23, 59, 59, 999);
    
    const fechaInicial = new Date();
    fechaInicial.setMonth(fechaInicial.getMonth() - 1);
    fechaInicial.setHours(0, 0, 0, 0);
    
    return [fechaInicial, fechaFinal];
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [evaluacionList, setEvaluacionList] = React.useState<ListEvaluacionResponse[]>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [showConfirmPDFModal, setShowConfirmPDFModal] = React.useState<boolean>(false);
  const [showPDFModal, setShowPDFModal] = React.useState<boolean>(false);
  const [paginationProps, setPaginationProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
    onPageChange: (page: number) => handlePagination(page),
  });

  const optionsSearch = [
    { value: 'dni', label: 'DNI' },
    { value: 'nombre', label: 'Nombres' },
  ];

  const optionsEstadoEvaluacion = [
    { value: 'TODOS', label: 'Todos' },
    { value: 'GENERADO', label: 'Generado' },
    { value: 'EN_PROCESO', label: 'En Proceso' },
    { value: 'FINALIZADO', label: 'Finalizado' },
    { value: 'FALLIDO', label: 'Fallido' },
  ];

  const ListEvaluaciones = async () => {
    const fechaFinal = new Date(selectedOptionFecha[1]);
    fechaFinal.setHours(23, 59, 59, 999);

    try {
      const request: ListEvaluacionRequest = {
        page: paginationProps.currentPage - 1,
        size: paginationProps.pageSize,
        dniPaciente: selectedOption === 'dni' ? search : undefined,
        nombrePaciente: selectedOption === 'nombre' ? search : undefined,
        estadoRegistro: true,
        estadoEvaluacion: selectedOptionEstado == 'TODOS' ? undefined : selectedOptionEstado,
        fechaEvaluacionInicio: format(selectedOptionFecha[0], 'yyyy-MM-dd HH:mm:ss') ?? null,
        fechaEvaluacionFin: format(fechaFinal, 'yyyy-MM-dd HH:mm:ss') ?? null
      }
      const response = await evaluacionService.getAllEvaluaciones(request);
      // Restar 5 horas a la fecha de evaluación de cada registro
      if (response.data && Array.isArray(response.data.content)) {
        response.data.content = response.data.content.map((item: any) => ({
          ...item,
          fechaEvaluacion: item.fechaEvaluacion
        ? format(new Date(new Date(item.fechaEvaluacion).getTime() - 5 * 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss')
        : item.fechaEvaluacion,
        }));
      }
      setPaginationProps(prevProps => ({
        ...prevProps,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalElements,
      }));
      setEvaluacionList(response.data.content);
      setLoading(false);
    } catch (error) {
      
      console.error('Error fetching pacientes:', error);
    }
  };

  const anularEvaluacion = async (id: string) => {
    try {
      const response = await evaluacionService.anularEvaluacion(id);
      if (response.status_code !== 200) {
        toast(response.message, {
        type: 'error',
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false
        });
        return;
      }
      toast(response.message, {
        type: 'success',
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false
      });
      setShowDeleteModal(false);
      ListEvaluaciones();
    } catch (error) {
      console.error('Error anular evaluacion:', error);
    }
  }

  const handleSearch = (value: string) => {
    setLoading(true);
    setSearch(value);
    ListEvaluaciones();    
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    ListEvaluaciones();
  };

  const handlePagination = (page: number) => {
    setLoading(true);
    setPaginationProps(prevProps => ({ ...prevProps, currentPage: page }));
  };

  React.useEffect(() => {
    setLoading(true);
    ListEvaluaciones();
  }, [paginationProps.currentPage, selectedOptionEstado, selectedOptionFecha]);

  const columns = [
    { title: 'DNI', key: 'dniPaciente' },
    { title: 'Nombre del paciente', key: 'nombrePaciente' },
    { title: 'Edad', key: 'edadPaciente' },
    { title: 'Fecha de evaluación', key: 'fechaEvaluacion' },
    {
      title: 'Estado',
      key: 'estado',
      render: (item: any) => (
        <span
          className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
            item.estadoEvaluacion === 'GENERADO'
              ? 'bg-blue-700/10 text-blue-700'
              : item.estadoEvaluacion === 'FALLIDO'
              ? 'bg-danger/10 text-danger'
              : item.estadoEvaluacion === 'FINALIZADO'
              ? 'bg-success/10 text-success'
              : 'bg-warning/10 text-warning'
          }`}
        >
          {item.estadoEvaluacion}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View',
      onClick: (item: any) => {
        navigate(`/resultados`, {
          state:{evaluacionId: item.id, nombrePaciente: item.nombrePaciente}});
      },
    },
    {
      label: 'Download',
      onClick: (item: any) => {
        setEvaluacionSelected(item);
        setShowConfirmPDFModal(true);
      },
    },
    { label: 'Delete', onClick: (item: any) => {
      console.log(item);
      setEvaluacionSelected(item);
      setShowDeleteModal(true)
    }},
  ];

  return (
    <>
      <Breadcumb pageName="Evaluaciones"></Breadcumb>
      
      <div className="flex flex-col gap-5 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
        <div className="flex items-end justify-between">
          <div className="flex flex-wrap gap-3 items-end">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Select
                options={optionsSearch}
                value={selectedOption}
                onChange={(value) => {
                  setSelectedOption(value);
                  setSearch('');
                }}
              />
              <Input
                placeholder="Buscar"
                isSearch
                value={search}
                type={selectedOption === 'dni' ? 'number' : 'text'}
                onChange={(e) => setSearch(e.target.value)}
                onSearchClick={(value) => handleSearch(value)}
              />
            </form>
            <DatePicker
              label='Fecha de evaluación'
              placeholder='dd/mm/yyyy'
              onChange={(date) => {
                if (date.length == 2) {
                  setSelectedOptionFecha(date);
                }
              }}
              mode='range'
              dateFormat='d-m-Y'
              wrapperClassName='w-64'
              inputClassName='w-full text-sm'
              defaultDate={selectedOptionFecha}
            />
            <Select
              label="Estado de evaluación"
              options={optionsEstadoEvaluacion}
              value={selectedOptionEstado}
              onChange={(value) => setSelectedOptionEstado(value)}
            />
          </div>
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            closeOnClickOutside={false}
            size="sm"
            title="Anular paciente"
            footer={
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => anularEvaluacion(evaluacionSelected.id)}
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

          <Modal
            isOpen={showConfirmPDFModal}
            onClose={() => setShowConfirmPDFModal(false)}
            closeOnClickOutside={false}
            size="sm"
            title="Generar reporte"
            footer={
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmPDFModal(false)}
                  className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setShowPDFModal(true)}
                  className="rounded-lg bg-primary px-6 py-2 text-white"
                >
                  Generar
                </button>
              </div>
            }
          >
            <div>
              <p>¿Estas seguro que deseas generar el reporte de este paciente?</p>
            </div>
          </Modal>
          <PdfViewerModal
            isOpen={showPDFModal}
            onClose={() => {setShowPDFModal(false); setShowConfirmPDFModal(false)}}
            evaluacionId={evaluacionSelected.id}
          />
        </div>
        <Table
          columns={columns}
          data={evaluacionList}
          actions={actions}
          paginationEnabled
          paginationProps={paginationProps}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Evaluaciones;
