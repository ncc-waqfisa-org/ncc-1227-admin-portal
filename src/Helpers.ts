import _, { round } from "lodash";
import {
  Admin,
  Application,
  FamilyIncome,
  Income,
  Program,
  Status,
} from "./API";

/* -------------------------------------------------------------------------- */
/*                                  INTERFACE                                 */
/* -------------------------------------------------------------------------- */
export interface TopGraphData {
  id: string;
  name: string;
  nameAr: string;
  count: number;
}

export interface IDateRange {
  start: string;
  end: string;
}

export interface GpaSummaryGraphData {
  monthName: string;
  meanGpa: number;
}

export interface WeeklySummaryGraphData {
  dayName: string;
  count: number;
}

export interface ApplicationSnapshot {
  gpa?: string;
  primaryProgram?: string;
  primaryProgramAcceptanceLetter?: string;
  secondaryProgram?: string;
  secondaryProgramAcceptanceLetter?: string;
  attachments?: {
    cpr?: string;
    transcript?: string;
    schoolCertificate?: string;
    signedContract?: string;
  };
}

export interface MasterApplicationSnapshot {
  gpa?: string;
  program: string;

  attachments?: {
    cpr?: string;
    transcript?: string;
    // schoolCertificate?: string;
    signedContract?: string;
    // cprDoc?: string | null;
    // signedContractDoc?: string | null;
    // transcriptDoc?: string | null;
    universityCertificate?: string | null;
    toeflIELTSCertificate?: string | null;
    acceptanceLetterDoc?: string | null;
  };
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

type TCalculateScore = {
  familyIncome: FamilyIncome | null | undefined;
  gpa: number;
  adminScore?: number;
};
export function calculateScore({
  familyIncome,
  gpa,
  adminScore = 0,
}: TCalculateScore) {
  let score = gpa * 0.7 + adminScore;
  if (familyIncome === FamilyIncome.LESS_THAN_1500) {
    score += 20;
  } else if (familyIncome === FamilyIncome.MORE_THAN_1500) {
    score += 10;
  }
  return round(score, 2);
}

// calculate score for master applicants
type TCalculateMasterScore = {
  income: Income | null | undefined;
  gpa: number;
  adminScore?: number;
};

export function calculateMasterScore({
  income,
  gpa,
  adminScore = 0,
}: TCalculateMasterScore) {
  // Convert GPA from 4.0 scale to 100 scale
  const gpaAs100 = (gpa / 4) * 100;

  let score = gpaAs100 * 0.7 + adminScore;

  if (income === Income.LESS_THAN_1500) {
    score += 20;
  } else if (income === Income.MORE_THAN_1500) {
    score += 10;
  }

  return round(score, 2);
}

export function giveMeTopUniversities(
  programs: (Program | null | undefined)[],
  top?: number
): TopGraphData[] {
  let topUniversitiesGraph: TopGraphData[] = [];

  let idWithCount = _.countBy(programs, (program) => program?.university?.id);

  _.forEach(idWithCount, function (value, key) {
    let tempTop: TopGraphData = {
      id: key,
      name:
        programs.find((p) => p?.university?.id === key)?.university?.name ??
        "-",
      nameAr:
        programs.find((p) => p?.university?.id === key)?.university?.nameAr ??
        "-",
      count: value,
    };

    topUniversitiesGraph.push(tempTop);
  });
  return topUniversitiesGraph
    .sort((a, b) => b.count - a.count)
    .splice(0, top ?? 5);
}

export function giveMeTopProgram(
  programs: (Program | null | undefined)[],
  top?: number
): TopGraphData[] {
  let topProgramsGraph: TopGraphData[] = [];

  let idWithCount = _.countBy(programs, (program) => program?.id);

  _.forEach(idWithCount, function (value, key) {
    let program = programs.find((p) => p?.id === key);

    let tempTop: TopGraphData = {
      id: key,
      name: `${program?.name} - ${program?.university?.name}`,
      nameAr: `${program?.nameAr} - ${program?.university?.nameAr}`,
      count: value,
    };

    topProgramsGraph.push(tempTop);
  });
  return topProgramsGraph.sort((a, b) => b.count - a.count).splice(0, top ?? 5);
}

export function giveMeApplicationsThisMonth(
  applications: Application[] | undefined
) {
  return applications

    ?.filter((app) => {
      const orderDate = new Date(app.dateTime);
      const today = new Date();
      const isThisYear = orderDate.getFullYear() === today.getFullYear();
      const isThisMonth = orderDate.getMonth() === today.getMonth();

      return isThisYear && isThisMonth;
    })
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
}

export function getApplicationsByMonth(
  applications: Application[] | undefined
) {
  return _.groupBy(applications, (app) => {
    let dateTime = new Date(app.dateTime);
    return dateTime.getMonth();
  });
}

export function getMeGpaSummary(applications: Application[] | undefined) {
  let applicationsPerMonth = getApplicationsByMonth(applications);

  let gpaSummaryData: GpaSummaryGraphData[] = [];

  _.forEach(applicationsPerMonth, (value, key) => {
    let data = {
      monthName: monthNames[Number(key)],
      meanGpa: _.meanBy(value, (app) => app.gpa),
    };
    gpaSummaryData.push(data);
  });

  return gpaSummaryData;
}

export function getMeWeeklySummary(applications: Application[] | undefined) {
  let applicationsThisWeek = applications?.filter((app) => {
    let d = new Date();

    d.setDate(d.getDate() - 7);

    return new Date(app.dateTime) > d && new Date(app.dateTime) <= new Date();
  });

  let weeklySummaryData: WeeklySummaryGraphData[] = [];

  let applicationsPerDay = _.groupBy(applicationsThisWeek, (app) => {
    return new Date(app.dateTime).getDay();
  });

  _.forEach(applicationsPerDay, (value, key) => {
    let data: WeeklySummaryGraphData = {
      dayName: daysOfWeekNames[Number(key)],
      count: value.length,
    };
    weeklySummaryData.push(data);
  });

  return weeklySummaryData;
}

export function getStatusOrder(status: Status) {
  switch (status) {
    case Status.APPROVED:
      return 1;
    case Status.ELIGIBLE:
      return 0.7;
    case Status.REVIEW:
      return 0.5;
    case Status.NOT_COMPLETED:
      return 0.3;
    case Status.REJECTED:
      return 0.2;
    case Status.WITHDRAWN:
      return 0.1;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    VARS                                    */
/* -------------------------------------------------------------------------- */

export const minimumGPA = 88;

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const daysOfWeekNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const SUPER_ADMIN = "SUPER_ADMIN";
export const ADMIN = "ADMIN";

export function compareAdmins(a: Admin, b: Admin): number {
  // Sort by role, with "SUPER_ADMIN" first
  if (a.role === SUPER_ADMIN && b.role !== SUPER_ADMIN) {
    return -1; // a should come before b
  } else if (a.role !== SUPER_ADMIN && b.role === SUPER_ADMIN) {
    return 1; // b should come before a
  }

  // Sort alphabetically by fullName
  return (a.fullName ?? "").localeCompare(b.fullName ?? "");
}

export function formatDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();

  const formattedDate: string = `${year.toString().slice(-2)}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  return formattedDate;
}

export function formatDateTime(date: Date): string {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();

  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const ampm: string = hours >= 12 ? "pm" : "am";
  const formattedHours: number = hours % 12 || 12;

  const formattedDateTime: string = `${year.toString().slice(-2)}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")} ${formattedHours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;

  return formattedDateTime;
}

/**
 * It checks if a file is too big
 * @param {File} [file] - The file that is being checked.
 * @returns A boolean value.
 */
export function checkIfFilesAreTooBig(file?: File, maxSize?: number): boolean {
  let valid = true;
  const allowedSizeInMegabytes = maxSize ?? 2;
  if (file) {
    const size = file.size / 1024 / 1024;
    if (size > allowedSizeInMegabytes) {
      valid = false;
    }
  }
  return valid;
}

export function getNamePart(
  fullName: string,
  part: "first" | "second" | "third" | "last"
): string {
  const nameParts = fullName.trim().split(" ");

  switch (part) {
    case "first":
      return nameParts[0] || "";
    case "second":
      // if (nameParts.length > 2) return nameParts[1];
      // return "";
      return nameParts[1] || "";
    case "third":
      // if (nameParts.length > 3) return nameParts[2];
      return nameParts[2] || "";

    case "last":
      // if (nameParts.length === 4) return nameParts[2];
      // if (nameParts.length === 4) return nameParts[2];
      if (nameParts.length >= 3) return nameParts[nameParts.length - 1];
      return "";
  }
}
