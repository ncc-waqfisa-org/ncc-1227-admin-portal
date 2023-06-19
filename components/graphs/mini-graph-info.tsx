import { ChartData } from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

export enum GraphColor {
  RED,
  YELLOW,
  GREEN,
}

interface Props {
  title: string;
  graphNum: number;
  graph: ChartData<"line", number[], string>;
  color: GraphColor;
}

export default function MiniGraphInfo({
  title,
  graphNum,
  graph,
  color,
}: Props) {
  const data = graph;

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor:
          color === GraphColor.YELLOW
            ? "#cf9f23"
            : color === GraphColor.RED
            ? "#f1492c"
            : "#47a04e",
      },
      point: {
        radius: 0,
        hitRadius: 0,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div
      className={`w-full rounded-xl p-7 ${
        color === GraphColor.YELLOW && "bg-anzac-50"
      } ${color === GraphColor.RED && "bg-pomegranate-50"} ${
        color === GraphColor.GREEN && "bg-goblin-50"
      }`}
    >
      <div className="flex flex-col w-full">
        <div className="text-xs font-semibold text-gray-600 ">{title}</div>
        <div className="flex justify-between p-4 grow">
          <div className="w-8 text-2xl ">{graphNum}</div>
          <Line data={data} className="" options={options} />
        </div>
      </div>
    </div>
  );
}
