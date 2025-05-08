import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartProps {
  series: number[];
  labels: string[];
  colors?: string[];
  title?: string;
  loading?: boolean;
  noDataMessage?: string;
}

const ChartDonut: React.FC<ChartProps> = ({
  series,
  labels,
  colors = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
  title = 'Visitors Analytics',
  loading = false,
  noDataMessage,
}) => {
  const options: ApexOptions = {
    chart: { fontFamily: 'Satoshi, sans-serif', type: 'donut' },
    colors,
    labels,
    legend: { show: false, position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%', background: 'transparent' } } },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 380 } } },
      { breakpoint: 640, options: { chart: { width: 200 } } },
    ],
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <h5 className="text-lg font-semibold text-black dark:text-white">{title}</h5>
      </div>

      <div className="mb-2">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin w-8 h-8 border-b-2 border-primary rounded-full"
              viewBox="0 0 24 24"
            />
            <span className="ml-2 text-sm text-gray-500">Cargando gráfico...</span>
          </div>
        ) : series.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-sm text-gray-500">
              {noDataMessage ?? 'No hay datos para mostrar.'}
            </span>
          </div>
        ) : (
          <>
            <div id="chartThree" className="mx-auto flex justify-center">
              <ReactApexChart options={options} series={series} type="donut" />
            </div>
            <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3 mt-4">
              {labels.map((label, index) => (
                <div className="sm:w-1/2 w-full px-8" key={index}>
                  <div className="flex w-full items-center">
                    <span
                      className="mr-2 block h-3 w-full max-w-3 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    />
                    <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                      <span>{label}</span>
                      <span>{series[index]}%</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartDonut;
