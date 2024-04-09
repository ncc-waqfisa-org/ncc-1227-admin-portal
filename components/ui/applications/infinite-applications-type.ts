import {
  FamilyIncome,
  Nationality,
  SchoolType,
  Status,
} from "../../../src/API";

export interface TInfiniteApplications {
  data: InfiniteApplication[];
  nextStartKey: NextStartKey;
}

export interface InfiniteApplication {
  _lastChangedAt: number;
  dateTime: Date;
  applicationAttachmentId: string;
  schoolType: SchoolType;
  nationalityCategory: Nationality;
  studentName: string;
  familyIncome: FamilyIncome;
  status: Status;
  schoolName: string;
  createdAt: Date;
  score: number;
  studentCPR: string;
  _version: number;
  gpa: number;
  updatedAt: Date;
  attachmentID: string;
  isEmailSent: boolean;
  id: string;
  batch: number;
  verifiedGpa: number;
}

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
