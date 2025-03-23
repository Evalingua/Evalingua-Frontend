import React from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Table from '../../components/Tables/Table';
import ChartArea from '../../components/Charts/ChartArea';

const Inicio: React.FC = () => {
    const columns = [
        {title: 'DNI', key: 'dni'},
        {title: 'Nombre del paciente', key: 'nombre'},
        {title: 'Fecha', key: 'fecha'},
    ]

    const data = [
      { dni: '76543210', nombre: 'Juan Perez Rodriguez', fecha: '12/12/2024' },
      { dni: '99787788', nombre: 'Jose Lopez', fecha: '18/12/2024' },
      { dni: '76543210', nombre: 'Juan Perez', fecha: '12/12/2024' },
      { dni: '99787788', nombre: 'Jose Lopez', fecha: '18/12/2024' },
      { dni: '99787788', nombre: 'Jose Lopez', fecha: '18/12/2024' },
    ];

    return (
      <>
        <Breadcrumb pageName="Inicio"></Breadcrumb>

        <div className="mt-4 h-full grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="flex flex-wrap gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-18">
            <button className="bg-sky_slate/40 dark:bg-sky_slate/30 p-5 w-fit rounded-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
                className="text-slate_blue dark:text-white"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="4"
                >
                  <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z" />
                  <path strokeLinecap="round" d="M24 16v16m-8-8h16" />
                </g>
              </svg>
              <h3 className="text-slate_blue font-bold dark:text-slate-200">
                Agregar paciente
              </h3>
            </button>
            <button className="bg-sky_slate/40 dark:bg-sky_slate/30 p-5 w-fit rounded-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 32 32"
                className="text-slate_blue dark:text-white"
              >
                <path
                  fill="currentColor"
                  d="m29.7 19.3l-3-3c-.4-.4-1-.4-1.4 0L16 25.6V30h4.4l9.3-9.3c.4-.4.4-1 0-1.4M19.6 28H18v-1.6l5-5l1.6 1.6zm6.4-6.4L24.4 20l1.6-1.6l1.6 1.6zM10 23h2v2h-2zm4-5h4v2h-4zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2z"
                />
                <path
                  fill="currentColor"
                  d="M7 28V7h3v3h12V7h3v6h2V7c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v1H7c-1.1 0-2 .9-2 2v21c0 1.1.9 2 2 2h5v-2zm5-24h8v4h-8z"
                />
              </svg>
              <h3 className="text-slate_blue font-bold dark:text-white">
                Ver resultados
              </h3>
            </button>
            <button className="bg-sky_slate/40 dark:bg-sky_slate/30 p-5 w-fit rounded-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="text-slate_blue dark:text-white"
              >
                <path
                  fill="currentColor"
                  d="M21 3H3a2 2 0 0 0-2 2v3h2V5h18v14h-7v2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2M1 18v3h3a3 3 0 0 0-3-3m0-4v2a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7m0-4v2a9 9 0 0 1 9 9h2c0-6.08-4.93-11-11-11m10 1.09v2L14.5 15l3.5-1.91v-2L14.5 13zM14.5 6L9 9l5.5 3L20 9z"
                />
              </svg>
              <h3 className="text-slate_blue font-bold dark:text-white">
                Ver tutorial de uso
              </h3>
            </button>
          </div>
          <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
            <h2 className="font-bold text-lg">Proximas evaluaciones</h2>
            <Table columns={columns} data={data} />
          </div>
          <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
            <ChartArea
              title="Resultados Generales de evaluaciones"
              categories={['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']}
              seriesData={[
                { name: 'Omisiones', data: [23, 11, 22, 27, 13, 22, 37] },
                { name: 'Sustituciones', data: [45, 35, 64, 52, 59, 36, 39] },
                { name: 'Distorsiones', data: [30, 25, 36, 30, 45, 35, 64] },
                { name: 'Logrados', data: [40, 30, 50, 20, 50, 30, 50] },
              ]}
              legendPosition="top"
              height={300}
              max_value={80}
            />
          </div>
        </div>
      </>
    );
};

export default Inicio;
