import type { NextApiRequest, NextApiResponse } from "next";

import Papa from "papaparse";
import fs from "fs";
import path from "path";
import {
  getAllApplicationsForCorrections,
  updateApplicationInDB,
} from "../../src/CustomAPI";
import { Application, UpdateApplicationMutationVariables } from "../../src/API";

type Data = {
  notCorrected: string[];
};

const saveFilePath = path.join(
  process.cwd(),
  "public",
  "csv/turned-to-zero-gpa.csv"
);

const correctFilePath = path.join(
  process.cwd(),
  "public",
  "csv/correct-gpa.csv"
);

const wrongFilePath = path.join(process.cwd(), "public", "csv/wrong-gpa.csv");
var counter = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const wrongData = readDataFromCSV(wrongFilePath);
  const correctData = readDataFromCSV(correctFilePath);
  const applications = await getAllApplicationsForCorrections(2023);
  const updateData = getCorrectDataToUpdate(
    wrongData,
    correctData,
    applications
  );

  saveDataIntoCSV(updateData.studentsWithNoCorrectGPA);

  for (const value of updateData.corrected) {
    await updateTheApplicationWithTimeout(value);
  }

  res.status(200).json({ notCorrected: updateData.studentsWithNoCorrectGPA });
}

function getCorrectDataToUpdate(
  wrong: {
    cpr: string;
    gpa: number;
  }[],
  correct: {
    cpr: string;
    gpa: number;
  }[],
  applications: Application[]
) {
  const studentsWithNoCorrectGPA: string[] = [];
  const corrected = wrong.map((d) => {
    const app = applications.find((c) => c.studentCPR === d.cpr);
    const correctGPA = correct.find((c) => c.cpr === d.cpr)?.gpa;

    if (correctGPA === 0) {
      studentsWithNoCorrectGPA.push(d.cpr);
    }

    return {
      cpr: d.cpr,
      gpa: correctGPA ?? d.gpa,
      _version: app?._version ?? 2,
      id: app?.id ?? "",
    };
  });

  return { corrected, studentsWithNoCorrectGPA };
}

function readDataFromCSV(path: string) {
  const csvData = fs.readFileSync(path, "utf-8");
  const { data } = Papa.parse<{
    cpr: string;
    gpa: string;
  }>(csvData, { header: true });
  const theData = data.map((d) => ({
    cpr: d.cpr.length < 9 ? `0${d.cpr}` : d.cpr,
    gpa: Number(d.gpa),
  }));
  return theData;
}

function saveDataIntoCSV(data: string[]) {
  const dataToSave = data.map((d) => ({
    cpr: d,
  }));

  const csvString = Papa.unparse(dataToSave);

  // Write the CSV data to the file
  fs.writeFileSync(saveFilePath, csvString, "utf-8");
}

async function updateTheApplication(data: {
  cpr: string;
  gpa: number;
  _version: number;
  id: string;
}) {
  const mutationVars: UpdateApplicationMutationVariables = {
    input: {
      id: data.id,
      _version: data._version,
      gpa: data.gpa,
    },
  };

  await updateApplicationInDB(mutationVars).then((v) => {
    if (v?.updateApplication?.id) {
      counter = counter + 1;
      console.log("counter", `${counter} - ${v?.updateApplication?.id}`);
    }
  });
}

function updateTheApplicationWithTimeout(data: {
  cpr: string;
  gpa: number;
  _version: number;
  id: string;
}): Promise<void> {
  return new Promise((resolve) => {
    // Simulating asynchronous operation with setTimeout
    setTimeout(async () => {
      await updateTheApplication(data);
      resolve();
    }, 1000);
  });
}
