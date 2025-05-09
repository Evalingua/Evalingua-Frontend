import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { ResultadoService } from '../../services/resultado/ResultadoService';
import { ResultadoDetalleService } from '../../services/resultado/ResultadoDetalleService';
import Table, { PaginationProps } from '../../components/Tables/Table';
import { toast } from 'react-toastify';
import { ListResultadoDetalleResponse, ListResultadoRequest, ResultadoDTOResponse } from '../../types/resultado.type';

const Resultados: React.FC = () => {
    const resultadoService = new ResultadoService();
    const resultadoDetalleService = new ResultadoDetalleService();
    const location = useLocation();
    const { evaluacionId, nombrePaciente } = location.state || {};
    const [resultados, setResultados] = React.useState<ResultadoDTOResponse[]>([]);
    const [resultadosDetalle, setResultadosDetalle] = React.useState<ListResultadoDetalleResponse[]>([]);
    const [loadingResultados, setLoadingResultados] = React.useState<boolean>(true);
    const [loadingResultadosDetalle, setLoadingResultadosDetalle] = React.useState<boolean>(false);
    const [paginationProps, setPaginationProps] = React.useState<PaginationProps>({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0,
        onPageChange: (page: number) => handlePagination(page),
    });

    React.useEffect(() => {
        ListResultados();
    }, [paginationProps.currentPage]);

    const ListResultados = async () => {
        try {
            const request: ListResultadoRequest = {
                evaluacionId: evaluacionId,
                page: paginationProps.currentPage - 1,
                size: paginationProps.pageSize,
            }
            const response = await resultadoService.getResultados(request);
            if (response.status_code === 200) {
                setResultados(response.data.content);
                setPaginationProps(prevProps => ({
                    ...prevProps,
                    totalPages: response.data.totalPages,
                    totalItems: response.data.totalElements,
                }));
                setLoadingResultados(false);
            } else {
                toast(`Error: ${response.message}`, { type: 'error', autoClose: 3000 });
            }            
        } catch (error) {
          toast(`Error: ${error}`, { type: 'error', autoClose: 3000 });
        }
    }

    const ListResultadosDetalle = async (resultadoId: number) => {
        try {
            const response = await resultadoDetalleService.getResultadosDetalle(resultadoId);
            if (response.status_code === 200) {
                setResultadosDetalle(response.data);
                setLoadingResultadosDetalle(false);
            } else {
                toast(`Alerta: ${response.message}`, { type: 'warning', autoClose: 3000 });
            }
        } catch (error) {
            toast(`Error: ${error}`, { type: 'error', autoClose: 3000 });
        }
    }
    
    const handlePagination = (page: number) => {
        console.log(page);
        setPaginationProps(prevProps => ({ ...prevProps, currentPage: page }));
    };

    const columnsResultado = [
        { title: "Fonema", key: "fonema" },
        { title: "Alteración", key: "alteracion",
            render: (item: ResultadoDTOResponse) => {
                const stateStyles: Record<string, string> = {
                    'FONETICO': 'bg-green-200/50 text-green-800',
                    'APRENDIDO': 'bg-blue-200/50 text-blue-800',
                    'FONOLOGICO': 'bg-yellow-200/50 text-yellow-800',
                    'NO_APRENDIDO': 'bg-red-200/50 text-red-800',
                    'DESCONOCIDO': 'bg-gray-200/50 text-gray-800',
                    'default': 'bg-gray-200/50 text-gray-800',
                }

                const stateClass = stateStyles[item.alteracion] || stateStyles['default'];
                return (
                    <span className={`inline-flex rounded-full py-1 px-3 text-sm font-semibold ${stateClass}`}>
                        {item.alteracion}
                    </span>
                )
            }
         },
    ]

    const actionsResultado = [
        {
            label: "View",
            onClick: (item: any) => {
                setLoadingResultadosDetalle(true);
                ListResultadosDetalle(item.id);
            }
        }
    ]

    const columnsResultadosDetalle = [
        { title: "Palabra", key: "palabra" },
        { title: "Posición", key: "posicion" },
        { title: "Trastorno", key: "trastorno",
            render: (item: ListResultadoDetalleResponse) => {
                const stateStyles: Record<string, string> = {
                    'LOGRADO': 'bg-green-200/50 text-green-800',
                    'OMISION': 'bg-blue-200/50 text-blue-800',
                    'SUSTITUCION': 'bg-yellow-200/50 text-yellow-800',
                    'DISTORSION': 'bg-red-200/50 text-red-800',
                    'DESCONOCIDO': 'bg-gray-200/50 text-gray-800',
                    'default': 'bg-gray-200/50 text-gray-800',
                }

                const stateClass = stateStyles[item.trastorno] || stateStyles['default'];
                return (
                    <span className={`inline-flex rounded-full py-1 px-3 text-sm font-semibold ${stateClass}`}>
                        {item.trastorno}
                    </span>
                )
            }
         },
        { title: "Audio", key: "audioUrl",
            render: (item: any) => (
                <audio src={item.audioUrl} controls></audio>
            )
         },
    ]

    const actionsResultadosDetalle = [
        {
            label: "Edit",
            onClick: (item: any) => {
                console.log(item);
            }
        }
    ]

    return (
        <>
            <Breadcrumb pageName={`Resultados de evaluación`} back/>
            <div className='grid grid-cols-12 gap-4'>
                <div className="flex flex-col h-fit gap-5 col-span-12 xl:col-span-4 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
                    <p className='font-medium'>Paciente: {nombrePaciente}</p>
                    <h2 className="font-bold text-lg">Fonemas evaluados:</h2>
                    <Table
                        columns={columnsResultado}
                        data={resultados}
                        actions={actionsResultado}
                        paginationEnabled
                        paginationProps={paginationProps}
                        loading={loadingResultados}
                    />
                </div>
                <div className="flex flex-col gap-5 h-fit col-span-12 xl:col-span-8 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
                    <h2 className="font-bold text-lg">Detalle de resultados por fonema:</h2>
                    { loadingResultadosDetalle || resultadosDetalle.length !== 0 ? (
                        <Table
                            columns={columnsResultadosDetalle}
                            data={resultadosDetalle}
                            /* actions={actionsResultadosDetalle} */
                            loading={loadingResultadosDetalle}
                    />
                    ) : (
                        <div className='flex flex-col items-center justify-center h-full py-8'>
                            <img src="/assets/choose.svg" alt="No hay resultados" className='size-1/6 opacity-60' />
                            <p className='font-medium text-md'>Seleccione un resultado para ver el detalle</p>
                        </div>
                    )}
                </div>
            </div>            
        </>
    )
}

export default Resultados;