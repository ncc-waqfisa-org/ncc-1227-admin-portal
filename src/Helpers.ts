import _ from "lodash";
import { Application, Program, Status } from "./API";

/* -------------------------------------------------------------------------- */
/*                                  INTERFACE                                 */
/* -------------------------------------------------------------------------- */
export interface TopGraphData {
  id: string;
  name: string;
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

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

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
        "Null",
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
