import React, { FC, PropsWithChildren } from "react";
import { Bar } from "react-chartjs-2";

interface Props {
  title: string;
  barLabel: string;
  subBarLabel: string;
  min?: number;
  max?: number;
  labels: string[];
  data: number[];
}

export const LargeBarGraphInfo: FC<PropsWithChildren<Props>> = ({
  title,
  barLabel,
  subBarLabel,
  min,
  max,
  labels,
  data,
  children,
}) => {
  const graph = {
    labels: labels,
    datasets: [
      {
        label: barLabel,
        data: data,
        borderRadius: 30,
        barThickness: 10,
        backgroundColor: ["rgb(225, 185, 61)"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        borderSkipped: "start",
        label: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: "circle",
        },
        title: {
          text: subBarLabel,
          display: true,
        },
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        min: min,
        max: max,
      },
    },
    barPercentage: 0.3,
    categoryPercentage: 1,
  };

  return (
    <div className="flex  flex-col justify-between w-full p-4 border min-h-[18rem]  rounded-xl bg-nccGray-50">
      <div className="flex flex-wrap items-center justify-between justify-items-center">
        {title}
        {children}
      </div>
      <div className="flex items-center justify-center mt-1 grow">
        <Bar data={graph} options={options} />
      </div>
    </div>
  );
};
