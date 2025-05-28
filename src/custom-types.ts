export type TStatistics = {
  scoreHistogram: { [key: string]: number };
  totalApplicationsPerUniversity: { [key: string]: number };
  totalApplicationsPerStatus: { [key: string]: number };
  gpaHistogram: { [key: string]: number };
  totalApplications: number;
  applications: TMoreStatisticsTotalApplications;
  id: number;
  batch: number;
  topUniversities: { [key: string]: number };
  students: TMoreStatisticsStudents;
  schoolType: TMoreStatisticsSchoolType;
  familyIncome: TMoreStatisticsFamilyIncome;
  today: TMoreStatisticsToday;
  participatingUniversities: string[];
  updatedAt: string;
};

export type TMastersStatistics = {
  scoreHistogram: { [key: string]: number };
  totalApplicationsPerUniversity: { [key: string]: number };
  totalApplicationsPerStatus: { [key: string]: number };
  gpaHistogram: { [key: string]: THistogram };
  totalApplications: number;
  applications: TMoreStatisticsTotalApplications;
  id: number;
  batch: number;
  topUniversities: { [key: string]: number };
  students: TMoreStatisticsStudents;
  today: TMoreStatisticsToday;
  participatingUniversities: string[];
  majorsPerGenderHistogram: TMoreStatisticsMajorHistogram;
  registerAccountsPerGender: THistogram;
  familyIncome: TMoreStatisticsFamilyIncome;
  universitiesBahrain: { [key: string]: number };
  incomePerEmploymentStatus: TMoreStatisticsIncomePerEmploymentStatus;
  topBahrainUniversities: { [key: string]: number }; //TODO fix this
  applicationPerGenderHistogram: THistogram;
};

export type TotalApplicationsPerStatus = {
  ELIGIBLE: number | undefined;
  WITHDRAWN: number | undefined;
  APPROVED: number | undefined;
  NOT_COMPLETED: number | undefined;
  REVIEW: number | undefined;
  REJECTED: number | undefined;
};

export type TMoreStatisticsToday = {
  students: TMoreStatisticsStudents;
  applications: TMoreStatisticsTotalApplications;
};

export type TMoreStatisticsTotalApplications = {
  female: number;
  total: number;
  male: number;
};

// done
export type TMoreStatisticsStudents = {
  female: number;
  total: number;
  male: number;
  genderDistribution?: TMoreStatisticsGenderRatio;
};

// done
export type TMoreStatisticsSchoolType = {
  private: TMoreStatisticsGenderRatio;
  privateToday: TMoreStatisticsGenderRatio;
  publicToday: TMoreStatisticsGenderRatio;
  public: TMoreStatisticsGenderRatio;
};

// done
export type TMoreStatisticsFamilyIncome = {
  below1500Today: TMoreStatisticsGenderRatio;
  above1500Today: TMoreStatisticsGenderRatio;
  below1500: TMoreStatisticsGenderRatio;
  above1500: TMoreStatisticsGenderRatio;
};

// done
export type TMoreStatisticsGenderRatio = {
  female: number;
  male: number;
};

export type TMoreStatisticsIncomePerEmploymentStatus = {
  Employed: TMoreIncomeStatus;
  Unemployed: TMoreIncomeStatus;
};

export type TMoreIncomeStatus = {
  LESS_THAN_1500: THistogram;
  MORE_THAN_1500: THistogram;
  total: number;
};

export type TMoreStatisticsMajorHistogram = {
  Science: THistogram;
  Technology: THistogram;
  Engineering: THistogram;
};

export type THistogram = {
  todayFemale?: number;
  todayTotal?: number;
  todayMale?: number;
  total?: number;
  female?: number;
  male?: number;
};
