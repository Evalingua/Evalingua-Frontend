import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import ChartThree from '../components/Charts/ChartThree';
import ChartArea from '../components/Charts/ChartArea';
import ChartBar from '../components/Charts/ChartBar';
import ChartDonut from '../components/Charts/ChartDonut';

const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartArea
          title="Reporte Mensual de Trastornos"
          categories={['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']}
          seriesData={[
            {
              name: 'Omisiones',
              data: [23, 11, 22, 27, 13, 22, 37],
            },
            {
              name: 'Distorsiones',
              data: [30, 25, 36, 30, 45, 35, 64],
            },
            {
              name: 'Sustituciones',
              data: [45, 35, 64, 52, 59, 36, 39],
            },
          ]}
          colors={['#FF5733', '#33FF57', '#5733FF']}
          legendPosition="top"
        />
        {/* <ChartOne /> */}
        <ChartBar
          title="Weekly Sales"
          categories={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
          seriesData={[
            { name: 'Product A', data: [70, 30, 50, 20, 80] },
            { name: 'Product B', data: [20, 40, 60, 30, 50] },
          ]}
          colors={['#FF5733', '#33FF57']}
          legendPosition="top"
        />
        <ChartDonut
          series={[64, 34, 22, 36]}
          labels={['Desktop', 'Tablet', 'Mobile', 'Unknown']}
          colors={['#FF5733', '#33FF57', '#3357FF', '#FF33A1']}
          title="Device Usage Analytics"
        />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
