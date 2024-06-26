import React, { FC, PropsWithChildren } from "react";
import { Doughnut } from "react-chartjs-2";
import PrimaryButton from "./../primary-button";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  labels: string[];
  data: number[];
  loading: boolean;
}

export const LargeDonutGraphInfo: FC<PropsWithChildren<Props>> = ({
  title,
  labels,
  data,
  children,
  loading,
}) => {
  const { t } = useTranslation("common");

  const graphData = {
    labels: labels ?? [],
    datasets: [
      {
        data: data ?? [],
        borderColor: [
          "rgb(240, 226, 152)",
          "rgb(225, 185, 61)",
          "rgb(201, 233, 201)",
          "rgb(255, 176, 163)",
        ],
        backgroundColor: [
          "rgb(240, 226, 152)",
          "rgb(225, 185, 61)",
          "rgb(201, 233, 201)",
          "rgb(255, 176, 163)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="flex flex-col justify-between w-full p-4 border  min-h-[18rem] rounded-xl bg-nccGray-50">
      <div className="flex flex-wrap items-center justify-between justify-items-center">
        {title}
        {children}
      </div>
      {loading ? (
        <div className="min-h-[12.8rem] flex justify-center items-center animate-pulse bg-black/10 rounded-md">
          <p>{t("loading")}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center grow">
          <Doughnut
            data={graphData}
            options={{
              maintainAspectRatio: false,
              elements: {
                arc: {
                  borderWidth: 3,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
