import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartBarProps {
  title?: string;
  categories?: string[];
  seriesData?: { name: string; data: number[] }[];
  colors?: string[];
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  horizontal?: boolean;
  loading?: boolean;
  noDataMessage?: string;
}

const ChartBar: React.FC<ChartBarProps> = ({
  title = 'Profit this week',
  categories = ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  seriesData = [
    { name: 'Sales', data: [44, 55, 41, 67, 22, 43, 65] }
  ],
  colors = ['#3C50E0', '#80CAEE'],
  legendPosition = 'top',
  horizontal = true,
  loading = false,
  noDataMessage = 'No hay datos disponibles',
}) => {
  const [state, setState] = useState({
    series: seriesData,
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;  

  const options: ApexOptions = {
    colors: colors,
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      /* stacked: true, */
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: { borderRadius: 0, columnWidth: '25%' },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: horizontal,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: categories },
    legend: {
      position: legendPosition,
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: { radius: 99 },
    },
    fill: { opacity: 1 },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-lg font-semibold text-black dark:text-white">
            {title}
          </h4>
        </div>
        <div>
        </div>
      </div>

      <div id="chartTwo" className="-ml-5 -mb-9">
      {loading ? (
        <div className="flex justify-center items-center h-80">
          <svg
            className="animate-spin w-8 h-8 border-b-2 border-primary rounded-full"
            viewBox="0 0 24 24"
          />
          <span className="ml-2 text-sm text-gray-500">
            Cargando gráfico...
          </span>
        </div>
      ) : (seriesData == null || seriesData.length === 0 || seriesData.every(s => s.data.every(v => v === 0))) ? (
        <div className="flex justify-center items-center h-80">
          <span className="text-sm text-gray-500">
            {noDataMessage ?? 'No hay datos para mostrar.'}
          </span>
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={state.series}
          type="bar"
          height={350}
        />
      )}
    </div>
    </div>
  );
};

export default ChartBar;
