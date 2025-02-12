import React, { FC, PropsWithChildren } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  barLabel: string;
  barLabel2: string;
  subBarLabel: string;
  min?: number;
  max?: number;
  labels: string[];
  data: number[];
  data2: number[];
  loading?: boolean;
}

export const LargeDualBarGraphInfo: FC<PropsWithChildren<Props>> = ({
  title,
  barLabel,
  barLabel2,
  subBarLabel,
  min,
  max,
  labels,
  data,
  data2,
  children,
  loading,
}) => {
  const { t } = useTranslation("common");

  const graph = {
    labels: labels,
    datasets: [
      {
        label: barLabel,
        data: data,
        borderRadius: 30,
        barThickness: 10,
        backgroundColor: ["rgb(240, 226, 152)"],
      },
      {
        label: barLabel2,
        data: data2,
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
      <div className="flex flex-wrap justify-between justify-items-center items-center">
        {title}
        {children}
      </div>
      {loading ? (
        <div className="min-h-[12.8rem] flex justify-center items-center animate-pulse bg-black/10 rounded-md">
          <p>{t("loading")}</p>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-1 grow">
          <Bar data={graph} options={options} />
        </div>
      )}
    </div>
  );
};
