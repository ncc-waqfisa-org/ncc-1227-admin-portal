import {
  FamilyIncome,
  Income,
  Major,
  Nationality,
  SchoolType,
} from "../../../src/API";

export interface TInfiniteMasterApplications {
  data: InfiniteMasterApplication[];
  nextStartKey: NextStartKey;
}
export interface TInfiniteApplications {
  data: InfiniteApplication[];
  nextStartKey: NextStartKey;
}

export type InfiniteApplication = {
  schoolType: SchoolType;
  nationalityCategory: Nationality;
  familyIncome: FamilyIncome;
  dateTime: Date;
  studentName: string;
  status: string;
  schoolName: string;
  score: number;
  universityID: string;
  _version: number;
  id: string;
  batch: number;
  verifiedGPA: number;
  __typename: string;
  isFamilyIncomeVerified: boolean;
  _lastChangedAt: number;
  applicationAttachmentId: string;
  processed: number;
  createdAt: Date;
  studentCPR: string;
  gpa: number;
  programID: string;
  updatedAt: Date;
  adminPoints: number;
  attachmentID: string;
  isEmailSent: boolean;
};
export type InfiniteMasterApplication = {
  major: Major;
  nationalityCategory: Nationality;
  income: Income;
  dateTime: Date;
  studentName: string;
  status: string;
  // TODO: check if we need universityNameAr
  universityName: string;
  universityNameAr: string;
  score: number;
  universityID: string;
  _version: number;
  id: string;
  batch: number;
  verifiedGPA: number;
  __typename: string;
  isIncomeVerified: boolean;
  _lastChangedAt: number;
  applicationAttachmentId: string;
  processed: number;
  createdAt: Date;
  studentCPR: string;
  gpa: number;
  program: string;
  updatedAt: Date;
  adminPoints: number;
  attachmentID: string;
  isEmailSent: boolean;
};

export interface NextStartKey {
  id: string;
  score: number;
  batch: number;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toTInfiniteApplications(json: string): TInfiniteApplications {
    return JSON.parse(json);
  }

  public static toTInfiniteMasterApplications(
    json: string
  ): TInfiniteMasterApplications {
    return JSON.parse(json);
  }

  public static tInfiniteApplicationsToJson(
    value: TInfiniteApplications
  ): string {
    return JSON.stringify(value);
  }
  public static tInfiniteMasterApplicationsToJson(
    value: TInfiniteMasterApplications
  ): string {
    return JSON.stringify(value);
  }
}
