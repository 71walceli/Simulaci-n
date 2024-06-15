import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { endOfDay, format, startOfDay } from 'date-fns';

//import { getMaxByKey, getMinByKey, groupObjectsByKey } from '../../../Common/Utils/reducers';
//import { DISPLAY_FORMATS } from '../../../Common/Utils';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function Chart({type, title, data, options}) {
  if (!data) {
    return <>No hay datos</>
  }
  // TODO Hash data, only update on hash change
  const chartData = React.useMemo(() => ({
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || "#aaa",
    }))
  }), [data, options])

  const chartOptions = React.useMemo(() => ({
    plugins: {
      legend: {
        position: data.length > 1 && "chartArea",
      },
      title: {
        display: Boolean(title),
        text: title,
      },
    },
    responsive: true,
    scales: Object.fromEntries(Object.entries(options.scales)
      .map(([key, value]) => [key, {
        ...value,
        title: {
          display: Boolean(value?.title),
          text: value?.title,
        },
      }])
    ),
    responsive: true,
    maintainAspectRatio: false,
    //elements: options.elements,
    //indexAxis: options.indexAxis,
    //maintainAspectRatio: false,
  }), [data, options]);
  
  const types = {
    Line,
    Bar,
    Scatter,
  }
  const Type = types[type]
  return (chartData && chartOptions ) && <Type options={chartOptions} data={chartData} 
    //responsive={false}
    style={{
      minHeight: 450,
    }} 
  />;
}


