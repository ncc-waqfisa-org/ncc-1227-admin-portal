export type TStatistics = {
  scoreHistogram: { [key: string]: number };
  totalApplicationsPerUniversity: TotalApplicationsPerUniversity;
  totalApplicationsPerStatus: TotalApplicationsPerStatus;
  gpaHistogram: { [key: string]: number };
  totalApplications: number;
  id: number;
  batch: number;
  topUniversities: { [key: string]: number };
};

export type TotalApplicationsPerStatus = {
  ELIGIBLE: number | undefined;
  WITHDRAWN: number | undefined;
  APPROVED: number | undefined;
  NOT_COMPLETED: number | undefined;
  REVIEW: number | undefined;
  REJECTED: number | undefined;
};

export type TotalApplicationsPerUniversity = {};
