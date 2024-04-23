import { FamilyIncome, Nationality, SchoolType } from "../../../src/API";

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

  public static tInfiniteApplicationsToJson(
    value: TInfiniteApplications
  ): string {
    return JSON.stringify(value);
  }
}
