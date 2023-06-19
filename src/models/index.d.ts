import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier, CustomIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum Status {
  APPROVED = "APPROVED",
  ELIGIBLE = "ELIGIBLE",
  REVIEW = "REVIEW",
  NOT_COMPLETED = "NOT_COMPLETED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export enum Language {
  ARABIC = "ARABIC",
  ENGLISH = "ENGLISH"
}

export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE"
}

export enum SchoolType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC"
}

export enum FamilyIncome {
  LESS_THAN_500 = "LESS_THAN_500",
  BETWEEN_500_AND_700 = "BETWEEN_500_AND_700",
  BETWEEN_700_AND_1000 = "BETWEEN_700_AND_1000",
  OVER_1000 = "OVER_1000"
}



type EagerAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Attachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cprDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly transcriptDoc?: string | null;
  readonly schoolCertificate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Attachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cprDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly transcriptDoc?: string | null;
  readonly schoolCertificate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Attachment = LazyLoading extends LazyLoadingDisabled ? EagerAttachment : LazyAttachment

export declare const Attachment: (new (init: ModelInit<Attachment>) => Attachment) & {
  copyOf(source: Attachment, mutator: (draft: MutableModel<Attachment>) => MutableModel<Attachment> | void): Attachment;
}

type EagerApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Application, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly gpa?: number | null;
  readonly status?: Status | keyof typeof Status | null;
  readonly attachmentID?: string | null;
  readonly studentCPR: string;
  readonly adminLogs?: (AdminLog | null)[] | null;
  readonly studentLogs?: (StudentLog | null)[] | null;
  readonly attachment?: Attachment | null;
  readonly programs?: (ProgramChoice | null)[] | null;
  readonly student?: Student | null;
  readonly dateTime: string;
  readonly isEmailSent?: boolean | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly batch?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationAttachmentId?: string | null;
}

type LazyApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Application, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly gpa?: number | null;
  readonly status?: Status | keyof typeof Status | null;
  readonly attachmentID?: string | null;
  readonly studentCPR: string;
  readonly adminLogs: AsyncCollection<AdminLog>;
  readonly studentLogs: AsyncCollection<StudentLog>;
  readonly attachment: AsyncItem<Attachment | undefined>;
  readonly programs: AsyncCollection<ProgramChoice>;
  readonly student: AsyncItem<Student | undefined>;
  readonly dateTime: string;
  readonly isEmailSent?: boolean | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly batch?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationAttachmentId?: string | null;
}

export declare type Application = LazyLoading extends LazyLoadingDisabled ? EagerApplication : LazyApplication

export declare const Application: (new (init: ModelInit<Application>) => Application) & {
  copyOf(source: Application, mutator: (draft: MutableModel<Application>) => MutableModel<Application> | void): Application;
}

type EagerProgramChoice = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramChoice, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programID: string;
  readonly applicationID: string;
  readonly program?: Program | null;
  readonly application?: Application | null;
  readonly choiceOrder?: number | null;
  readonly acceptanceLetterDoc?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationProgramsId?: string | null;
  readonly programApplicationsId?: string | null;
}

type LazyProgramChoice = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ProgramChoice, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly programID: string;
  readonly applicationID: string;
  readonly program: AsyncItem<Program | undefined>;
  readonly application: AsyncItem<Application | undefined>;
  readonly choiceOrder?: number | null;
  readonly acceptanceLetterDoc?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationProgramsId?: string | null;
  readonly programApplicationsId?: string | null;
}

export declare type ProgramChoice = LazyLoading extends LazyLoadingDisabled ? EagerProgramChoice : LazyProgramChoice

export declare const ProgramChoice: (new (init: ModelInit<ProgramChoice>) => ProgramChoice) & {
  copyOf(source: ProgramChoice, mutator: (draft: MutableModel<ProgramChoice>) => MutableModel<ProgramChoice> | void): ProgramChoice;
}

type EagerProgram = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Program, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly requirements?: string | null;
  readonly nameAr?: string | null;
  readonly requirementsAr?: string | null;
  readonly availability?: number | null;
  readonly universityID: string;
  readonly university?: University | null;
  readonly applications?: (ProgramChoice | null)[] | null;
  readonly isDeactivated?: boolean | null;
  readonly isTrashed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly universityProgramsId?: string | null;
}

type LazyProgram = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Program, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly requirements?: string | null;
  readonly nameAr?: string | null;
  readonly requirementsAr?: string | null;
  readonly availability?: number | null;
  readonly universityID: string;
  readonly university: AsyncItem<University | undefined>;
  readonly applications: AsyncCollection<ProgramChoice>;
  readonly isDeactivated?: boolean | null;
  readonly isTrashed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly universityProgramsId?: string | null;
}

export declare type Program = LazyLoading extends LazyLoadingDisabled ? EagerProgram : LazyProgram

export declare const Program: (new (init: ModelInit<Program>) => Program) & {
  copyOf(source: Program, mutator: (draft: MutableModel<Program>) => MutableModel<Program> | void): Program;
}

type EagerUniversity = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<University, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly nameAr?: string | null;
  readonly Programs?: (Program | null)[] | null;
  readonly availability?: number | null;
  readonly isDeactivated?: boolean | null;
  readonly isTrashed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUniversity = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<University, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly nameAr?: string | null;
  readonly Programs: AsyncCollection<Program>;
  readonly availability?: number | null;
  readonly isDeactivated?: boolean | null;
  readonly isTrashed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type University = LazyLoading extends LazyLoadingDisabled ? EagerUniversity : LazyUniversity

export declare const University: (new (init: ModelInit<University>) => University) & {
  copyOf(source: University, mutator: (draft: MutableModel<University>) => MutableModel<University> | void): University;
}

type EagerAdminLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AdminLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationID: string;
  readonly adminCPR: string;
  readonly dateTime?: string | null;
  readonly snapshot?: string | null;
  readonly reason?: string | null;
  readonly admin?: Admin | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationAdminLogsId?: string | null;
  readonly adminAdminLogsCpr?: string | null;
}

type LazyAdminLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AdminLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationID: string;
  readonly adminCPR: string;
  readonly dateTime?: string | null;
  readonly snapshot?: string | null;
  readonly reason?: string | null;
  readonly admin: AsyncItem<Admin | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationAdminLogsId?: string | null;
  readonly adminAdminLogsCpr?: string | null;
}

export declare type AdminLog = LazyLoading extends LazyLoadingDisabled ? EagerAdminLog : LazyAdminLog

export declare const AdminLog: (new (init: ModelInit<AdminLog>) => AdminLog) & {
  copyOf(source: AdminLog, mutator: (draft: MutableModel<AdminLog>) => MutableModel<AdminLog> | void): AdminLog;
}

type EagerStudentLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StudentLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationID: string;
  readonly studentCPR: string;
  readonly dateTime?: string | null;
  readonly snapshot?: string | null;
  readonly reason?: string | null;
  readonly student?: Student | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationStudentLogsId?: string | null;
  readonly studentStudentLogsCpr?: string | null;
}

type LazyStudentLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StudentLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly applicationID: string;
  readonly studentCPR: string;
  readonly dateTime?: string | null;
  readonly snapshot?: string | null;
  readonly reason?: string | null;
  readonly student: AsyncItem<Student | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationStudentLogsId?: string | null;
  readonly studentStudentLogsCpr?: string | null;
}

export declare type StudentLog = LazyLoading extends LazyLoadingDisabled ? EagerStudentLog : LazyStudentLog

export declare const StudentLog: (new (init: ModelInit<StudentLog>) => StudentLog) & {
  copyOf(source: StudentLog, mutator: (draft: MutableModel<StudentLog>) => MutableModel<StudentLog> | void): StudentLog;
}

type EagerAdmin = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Admin, 'cpr'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly cpr: string;
  readonly fullName?: string | null;
  readonly email?: string | null;
  readonly AdminLogs?: (AdminLog | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAdmin = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Admin, 'cpr'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly cpr: string;
  readonly fullName?: string | null;
  readonly email?: string | null;
  readonly AdminLogs: AsyncCollection<AdminLog>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Admin = LazyLoading extends LazyLoadingDisabled ? EagerAdmin : LazyAdmin

export declare const Admin: (new (init: ModelInit<Admin>) => Admin) & {
  copyOf(source: Admin, mutator: (draft: MutableModel<Admin>) => MutableModel<Admin> | void): Admin;
}

type EagerParentInfo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ParentInfo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly guardianFullName?: string | null;
  readonly relation?: string | null;
  readonly guardianCPR?: string | null;
  readonly primaryMobile?: string | null;
  readonly secondaryMobile?: string | null;
  readonly fatherFullName?: string | null;
  readonly fatherCPR?: string | null;
  readonly motherFullName?: string | null;
  readonly motherCPR?: string | null;
  readonly numberOfFamilyMembers?: number | null;
  readonly address?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyParentInfo = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ParentInfo, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly guardianFullName?: string | null;
  readonly relation?: string | null;
  readonly guardianCPR?: string | null;
  readonly primaryMobile?: string | null;
  readonly secondaryMobile?: string | null;
  readonly fatherFullName?: string | null;
  readonly fatherCPR?: string | null;
  readonly motherFullName?: string | null;
  readonly motherCPR?: string | null;
  readonly numberOfFamilyMembers?: number | null;
  readonly address?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ParentInfo = LazyLoading extends LazyLoadingDisabled ? EagerParentInfo : LazyParentInfo

export declare const ParentInfo: (new (init: ModelInit<ParentInfo>) => ParentInfo) & {
  copyOf(source: ParentInfo, mutator: (draft: MutableModel<ParentInfo>) => MutableModel<ParentInfo> | void): ParentInfo;
}

type EagerStudent = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Student, 'cpr'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly cpr: string;
  readonly cprDoc?: string | null;
  readonly fullName?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly gender?: Gender | keyof typeof Gender | null;
  readonly nationality?: string | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly specialization?: string | null;
  readonly placeOfBirth?: string | null;
  readonly studentOrderAmongSiblings?: number | null;
  readonly householdIncome?: number | null;
  readonly familyIncome?: FamilyIncome | keyof typeof FamilyIncome | null;
  readonly familyIncomeProofDoc?: string | null;
  readonly familyIncomeProofDocs?: (string | null)[] | null;
  readonly preferredLanguage?: Language | keyof typeof Language | null;
  readonly graduationDate?: string | null;
  readonly address?: string | null;
  readonly applications?: (Application | null)[] | null;
  readonly ParentInfo?: ParentInfo | null;
  readonly parentInfoID?: string | null;
  readonly StudentLogs?: (StudentLog | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStudent = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Student, 'cpr'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly cpr: string;
  readonly cprDoc?: string | null;
  readonly fullName?: string | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly gender?: Gender | keyof typeof Gender | null;
  readonly nationality?: string | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly specialization?: string | null;
  readonly placeOfBirth?: string | null;
  readonly studentOrderAmongSiblings?: number | null;
  readonly householdIncome?: number | null;
  readonly familyIncome?: FamilyIncome | keyof typeof FamilyIncome | null;
  readonly familyIncomeProofDoc?: string | null;
  readonly familyIncomeProofDocs?: (string | null)[] | null;
  readonly preferredLanguage?: Language | keyof typeof Language | null;
  readonly graduationDate?: string | null;
  readonly address?: string | null;
  readonly applications: AsyncCollection<Application>;
  readonly ParentInfo: AsyncItem<ParentInfo | undefined>;
  readonly parentInfoID?: string | null;
  readonly StudentLogs: AsyncCollection<StudentLog>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Student = LazyLoading extends LazyLoadingDisabled ? EagerStudent : LazyStudent

export declare const Student: (new (init: ModelInit<Student>) => Student) & {
  copyOf(source: Student, mutator: (draft: MutableModel<Student>) => MutableModel<Student> | void): Student;
}