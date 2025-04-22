import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartThreeState {
  series: number[];
}

interface ChartProps {
  series: number[];
  labels: string[];
  colors?: string[];
  title?: string;
}

const ChartDonut: React.FC<ChartProps> = ({
  series,
  labels,
  colors = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
  title = 'Visitors Analytics',
}) => {
  const [chartSeries, setChartSeries] = useState<ChartThreeState>({
    series: series,
  });

  const handleReset = () => {
    setChartSeries((prevState) => ({
      ...prevState,
      series: series,
    }));
  };
  handleReset;

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: colors,
    labels: labels,
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-lg font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>
        <div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={chartSeries.series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {labels.map((label, index) => (
          <div className="sm:w-1/2 w-full px-8" key={index}>
            <div className="flex w-full items-center">
              <span
                className="mr-2 block h-3 w-full max-w-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              ></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>{series[index]}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartDonut;
