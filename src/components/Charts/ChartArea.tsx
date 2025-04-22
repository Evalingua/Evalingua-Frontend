import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

// Define la estructura de las props que aceptará el componente
interface ChartProps {
  title?: string;
  categories: string[];
  seriesData: {
    name: string;
    data: number[];
  }[];
  colors?: string[];
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  max_value?: number;
  height?: number;
}

const ChartArea: React.FC<ChartProps> = ({
  title = 'Default Title',
  categories,
  seriesData,
  colors = ['#FFB000', '#3C50E0', '#80CAEE', '#3056D3'],
  legendPosition = 'top',
  max_value = 100,
  height = 350,

}) => {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: legendPosition,
      horizontalAlign: 'left',
    },
    colors: colors,
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#fff',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: colors,
      strokeWidth: 3,
      fillOpacity: 1,
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: max_value,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <h2 className="text-lg font-semibold text-black dark:text-white">{title}</h2>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={seriesData}
            type="area"
            height={height}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartArea;
