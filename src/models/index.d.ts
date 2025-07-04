import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier, CustomIdentifier, OptionallyManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum AdminRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export enum Status {
  APPROVED = "APPROVED",
  ELIGIBLE = "ELIGIBLE",
  REVIEW = "REVIEW",
  NOT_COMPLETED = "NOT_COMPLETED",
  NOT_COMPLETED_MARKED_BY_ADMIN = "NOT_COMPLETED_MARKED_BY_ADMIN",
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

export enum Nationality {
  BAHRAINI = "BAHRAINI",
  NON_BAHRAINI = "NON_BAHRAINI"
}

export enum FamilyIncome {
  LESS_THAN_500 = "LESS_THAN_500",
  BETWEEN_500_AND_700 = "BETWEEN_500_AND_700",
  BETWEEN_700_AND_1000 = "BETWEEN_700_AND_1000",
  LESS_THAN_1500 = "LESS_THAN_1500",
  MORE_THAN_1500 = "MORE_THAN_1500",
  OVER_1000 = "OVER_1000"
}

export enum ScholarshipStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

export enum ApplicantType {
  STUDENT = "STUDENT",
  MASTER = "MASTER"
}

export enum Income {
  LESS_THAN_1500 = "LESS_THAN_1500",
  MORE_THAN_1500 = "MORE_THAN_1500"
}

export enum Major {
  SCIENCE = "SCIENCE",
  TECHNOLOGY = "TECHNOLOGY",
  ENGINEERING = "ENGINEERING"
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
  readonly verifiedGPA?: number | null;
  readonly status?: Status | keyof typeof Status | null;
  readonly attachmentID?: string | null;
  readonly adminLogs?: (AdminLog | null)[] | null;
  readonly studentLogs?: (StudentLog | null)[] | null;
  readonly attachment?: Attachment | null;
  readonly programs?: (ProgramChoice | null)[] | null;
  readonly dateTime: string;
  readonly isEmailSent?: boolean | null;
  readonly nationalityCategory?: Nationality | keyof typeof Nationality | null;
  readonly familyIncome?: FamilyIncome | keyof typeof FamilyIncome | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly studentName?: string | null;
  readonly programID?: string | null;
  readonly program?: Program | null;
  readonly universityID?: string | null;
  readonly university?: University | null;
  readonly studentCPR: string;
  readonly allProgramsTextOption?: string | null;
  readonly student?: Student | null;
  readonly batch?: number | null;
  readonly score?: number | null;
  readonly adminPoints?: number | null;
  readonly processed?: number | null;
  readonly isFamilyIncomeVerified?: boolean | null;
  readonly reason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationAttachmentId?: string | null;
  readonly programApplicationId?: string | null;
  readonly universityApplicationsId?: string | null;
}

type LazyApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Application, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly gpa?: number | null;
  readonly verifiedGPA?: number | null;
  readonly status?: Status | keyof typeof Status | null;
  readonly attachmentID?: string | null;
  readonly adminLogs: AsyncCollection<AdminLog>;
  readonly studentLogs: AsyncCollection<StudentLog>;
  readonly attachment: AsyncItem<Attachment | undefined>;
  readonly programs: AsyncCollection<ProgramChoice>;
  readonly dateTime: string;
  readonly isEmailSent?: boolean | null;
  readonly nationalityCategory?: Nationality | keyof typeof Nationality | null;
  readonly familyIncome?: FamilyIncome | keyof typeof FamilyIncome | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly studentName?: string | null;
  readonly programID?: string | null;
  readonly program: AsyncItem<Program | undefined>;
  readonly universityID?: string | null;
  readonly university: AsyncItem<University | undefined>;
  readonly studentCPR: string;
  readonly allProgramsTextOption?: string | null;
  readonly student: AsyncItem<Student | undefined>;
  readonly batch?: number | null;
  readonly score?: number | null;
  readonly adminPoints?: number | null;
  readonly processed?: number | null;
  readonly isFamilyIncomeVerified?: boolean | null;
  readonly reason?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly applicationAttachmentId?: string | null;
  readonly programApplicationId?: string | null;
  readonly universityApplicationsId?: string | null;
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
  readonly minimumGPA?: number | null;
  readonly requirements?: string | null;
  readonly nameAr?: string | null;
  readonly requirementsAr?: string | null;
  readonly availability?: number | null;
  readonly universityID: string;
  readonly university?: University | null;
  readonly applications?: (ProgramChoice | null)[] | null;
  readonly isDeactivated?: boolean | null;
  readonly isTrashed?: boolean | null;
  readonly application?: (Application | null)[] | null;
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
  readonly minimumGPA?: number | null;
  readonly requirements?: string | null;
  readonly nameAr?: string | null;
  readonly requirementsAr?: string | null;
  readonly availability?: number | null;
  readonly universityID: string;
  readonly university: AsyncItem<University | undefined>;
  readonly applications: AsyncCollection<ProgramChoice>;
  readonly isDeactivated?: boolean | null;
  readonly isTrashed?: boolean | null;
  readonly application: AsyncCollection<Application>;
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
  readonly isExtended?: number | null;
  readonly extensionDuration?: number | null;
  readonly isException?: number | null;
  readonly isTrashed?: boolean | null;
  readonly applications?: (Application | null)[] | null;
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
  readonly isExtended?: number | null;
  readonly extensionDuration?: number | null;
  readonly isException?: number | null;
  readonly isTrashed?: boolean | null;
  readonly applications: AsyncCollection<Application>;
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
  readonly masterApplicationAdminLogsId?: string | null;
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
  readonly masterApplicationAdminLogsId?: string | null;
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
  readonly masterApplicationStudentLogsId?: string | null;
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
  readonly masterApplicationStudentLogsId?: string | null;
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
  readonly role?: AdminRole | keyof typeof AdminRole | null;
  readonly isDeactivated?: boolean | null;
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
  readonly role?: AdminRole | keyof typeof AdminRole | null;
  readonly isDeactivated?: boolean | null;
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
  readonly guardianFirstName?: string | null;
  readonly guardianSecondName?: string | null;
  readonly guardianThirdName?: string | null;
  readonly guardianLastName?: string | null;
  readonly guardianEmail?: string | null;
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
  readonly guardianFirstName?: string | null;
  readonly guardianSecondName?: string | null;
  readonly guardianThirdName?: string | null;
  readonly guardianLastName?: string | null;
  readonly guardianEmail?: string | null;
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
  readonly batch?: number | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly gender?: Gender | keyof typeof Gender | null;
  readonly nationalityCategory?: Nationality | keyof typeof Nationality | null;
  readonly nationality?: string | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly specialization?: string | null;
  readonly placeOfBirth?: string | null;
  readonly studentOrderAmongSiblings?: number | null;
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
  readonly firstName?: string | null;
  readonly secondName?: string | null;
  readonly thirdName?: string | null;
  readonly lastName?: string | null;
  readonly dob?: string | null;
  readonly schoolMajor?: string | null;
  readonly m_MasterLogs?: (MasterLog | null)[] | null;
  readonly m_firstName?: string | null;
  readonly m_secondName?: string | null;
  readonly m_thirdName?: string | null;
  readonly m_lastName?: string | null;
  readonly m_numberOfFamilyMembers?: number | null;
  readonly m_graduationYear?: string | null;
  readonly m_university?: BahrainUniversities | null;
  readonly m_universityID?: string | null;
  readonly m_oldProgram?: string | null;
  readonly m_applicantType?: (ApplicantType | null)[] | Array<keyof typeof ApplicantType> | null;
  readonly m_isEmployed?: boolean | null;
  readonly m_placeOfEmployment?: string | null;
  readonly m_income?: Income | keyof typeof Income | null;
  readonly m_incomeDoc?: string | null;
  readonly m_guardianCPR?: string | null;
  readonly m_guardianFullName?: string | null;
  readonly m_guardianCPRDoc?: string | null;
  readonly m_masterApplications?: (MasterApplication | null)[] | null;
  readonly m_guardianFirstName?: string | null;
  readonly m_guardianSecondName?: string | null;
  readonly m_guardianThirdName?: string | null;
  readonly m_guardianLastName?: string | null;
  readonly m_guardianEmail?: string | null;
  readonly m_guardianAddress?: string | null;
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
  readonly batch?: number | null;
  readonly email?: string | null;
  readonly phone?: string | null;
  readonly gender?: Gender | keyof typeof Gender | null;
  readonly nationalityCategory?: Nationality | keyof typeof Nationality | null;
  readonly nationality?: string | null;
  readonly schoolName?: string | null;
  readonly schoolType?: SchoolType | keyof typeof SchoolType | null;
  readonly specialization?: string | null;
  readonly placeOfBirth?: string | null;
  readonly studentOrderAmongSiblings?: number | null;
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
  readonly firstName?: string | null;
  readonly secondName?: string | null;
  readonly thirdName?: string | null;
  readonly lastName?: string | null;
  readonly dob?: string | null;
  readonly schoolMajor?: string | null;
  readonly m_MasterLogs: AsyncCollection<MasterLog>;
  readonly m_firstName?: string | null;
  readonly m_secondName?: string | null;
  readonly m_thirdName?: string | null;
  readonly m_lastName?: string | null;
  readonly m_numberOfFamilyMembers?: number | null;
  readonly m_graduationYear?: string | null;
  readonly m_university: AsyncItem<BahrainUniversities | undefined>;
  readonly m_universityID?: string | null;
  readonly m_oldProgram?: string | null;
  readonly m_applicantType?: (ApplicantType | null)[] | Array<keyof typeof ApplicantType> | null;
  readonly m_isEmployed?: boolean | null;
  readonly m_placeOfEmployment?: string | null;
  readonly m_income?: Income | keyof typeof Income | null;
  readonly m_incomeDoc?: string | null;
  readonly m_guardianCPR?: string | null;
  readonly m_guardianFullName?: string | null;
  readonly m_guardianCPRDoc?: string | null;
  readonly m_masterApplications: AsyncCollection<MasterApplication>;
  readonly m_guardianFirstName?: string | null;
  readonly m_guardianSecondName?: string | null;
  readonly m_guardianThirdName?: string | null;
  readonly m_guardianLastName?: string | null;
  readonly m_guardianEmail?: string | null;
  readonly m_guardianAddress?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Student = LazyLoading extends LazyLoadingDisabled ? EagerStudent : LazyStudent

export declare const Student: (new (init: ModelInit<Student>) => Student) & {
  copyOf(source: Student, mutator: (draft: MutableModel<Student>) => MutableModel<Student> | void): Student;
}

type EagerBatch = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Batch, 'batch'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly batch: number;
  readonly createApplicationStartDate?: string | null;
  readonly createApplicationEndDate?: string | null;
  readonly updateApplicationEndDate?: string | null;
  readonly signUpStartDate?: string | null;
  readonly signUpEndDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBatch = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Batch, 'batch'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly batch: number;
  readonly createApplicationStartDate?: string | null;
  readonly createApplicationEndDate?: string | null;
  readonly updateApplicationEndDate?: string | null;
  readonly signUpStartDate?: string | null;
  readonly signUpEndDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Batch = LazyLoading extends LazyLoadingDisabled ? EagerBatch : LazyBatch

export declare const Batch: (new (init: ModelInit<Batch>) => Batch) & {
  copyOf(source: Batch, mutator: (draft: MutableModel<Batch>) => MutableModel<Batch> | void): Batch;
}

type EagerScholarship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Scholarship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status?: ScholarshipStatus | keyof typeof ScholarshipStatus | null;
  readonly applicationID: string;
  readonly batch?: number | null;
  readonly isConfirmed?: boolean | null;
  readonly application?: Application | null;
  readonly studentCPR?: string | null;
  readonly unsignedContractDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly studentSignature?: string | null;
  readonly guardianSignature?: string | null;
  readonly bankName?: string | null;
  readonly IBAN?: string | null;
  readonly IBANLetterDoc?: string | null;
  readonly startDate?: string | null;
  readonly scholarshipPeriod?: number | null;
  readonly numberOfSemesters?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyScholarship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Scholarship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status?: ScholarshipStatus | keyof typeof ScholarshipStatus | null;
  readonly applicationID: string;
  readonly batch?: number | null;
  readonly isConfirmed?: boolean | null;
  readonly application: AsyncItem<Application | undefined>;
  readonly studentCPR?: string | null;
  readonly unsignedContractDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly studentSignature?: string | null;
  readonly guardianSignature?: string | null;
  readonly bankName?: string | null;
  readonly IBAN?: string | null;
  readonly IBANLetterDoc?: string | null;
  readonly startDate?: string | null;
  readonly scholarshipPeriod?: number | null;
  readonly numberOfSemesters?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Scholarship = LazyLoading extends LazyLoadingDisabled ? EagerScholarship : LazyScholarship

export declare const Scholarship: (new (init: ModelInit<Scholarship>) => Scholarship) & {
  copyOf(source: Scholarship, mutator: (draft: MutableModel<Scholarship>) => MutableModel<Scholarship> | void): Scholarship;
}

type EagerStatistics = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<Statistics, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: number;
  readonly batch: number;
  readonly totalApplications?: number | null;
  readonly totalApplicationsPerStatus?: string | null;
  readonly scoreHistogram?: string | null;
  readonly gpaHistogram?: string | null;
  readonly totalApplicationsPerUniversity?: string | null;
  readonly topUniversities?: string | null;
  readonly topPrograms?: string | null;
  readonly familyIncome?: string | null;
  readonly schoolType?: string | null;
  readonly students?: string | null;
  readonly applications?: string | null;
  readonly today?: string | null;
  readonly participatingUniversities?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStatistics = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<Statistics, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: number;
  readonly batch: number;
  readonly totalApplications?: number | null;
  readonly totalApplicationsPerStatus?: string | null;
  readonly scoreHistogram?: string | null;
  readonly gpaHistogram?: string | null;
  readonly totalApplicationsPerUniversity?: string | null;
  readonly topUniversities?: string | null;
  readonly topPrograms?: string | null;
  readonly familyIncome?: string | null;
  readonly schoolType?: string | null;
  readonly students?: string | null;
  readonly applications?: string | null;
  readonly today?: string | null;
  readonly participatingUniversities?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Statistics = LazyLoading extends LazyLoadingDisabled ? EagerStatistics : LazyStatistics

export declare const Statistics: (new (init: ModelInit<Statistics>) => Statistics) & {
  copyOf(source: Statistics, mutator: (draft: MutableModel<Statistics>) => MutableModel<Statistics> | void): Statistics;
}

type EagerMasterBatch = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<MasterBatch, 'batch'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly batch: number;
  readonly createApplicationStartDate?: string | null;
  readonly createApplicationEndDate?: string | null;
  readonly updateApplicationEndDate?: string | null;
  readonly signUpStartDate?: string | null;
  readonly signUpEndDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMasterBatch = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<MasterBatch, 'batch'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly batch: number;
  readonly createApplicationStartDate?: string | null;
  readonly createApplicationEndDate?: string | null;
  readonly updateApplicationEndDate?: string | null;
  readonly signUpStartDate?: string | null;
  readonly signUpEndDate?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MasterBatch = LazyLoading extends LazyLoadingDisabled ? EagerMasterBatch : LazyMasterBatch

export declare const MasterBatch: (new (init: ModelInit<MasterBatch>) => MasterBatch) & {
  copyOf(source: MasterBatch, mutator: (draft: MutableModel<MasterBatch>) => MutableModel<MasterBatch> | void): MasterBatch;
}

type EagerMasterLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterLog, 'id'>;
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
  readonly studentM_MasterLogsCpr?: string | null;
  readonly masterApplicationMasterLogsId?: string | null;
}

type LazyMasterLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterLog, 'id'>;
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
  readonly studentM_MasterLogsCpr?: string | null;
  readonly masterApplicationMasterLogsId?: string | null;
}

export declare type MasterLog = LazyLoading extends LazyLoadingDisabled ? EagerMasterLog : LazyMasterLog

export declare const MasterLog: (new (init: ModelInit<MasterLog>) => MasterLog) & {
  copyOf(source: MasterLog, mutator: (draft: MutableModel<MasterLog>) => MutableModel<MasterLog> | void): MasterLog;
}

type EagerBahrainUniversities = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<BahrainUniversities, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly universityName?: string | null;
  readonly universityNameAr?: string | null;
  readonly isDeactivated?: boolean | null;
  readonly students?: (Student | null)[] | null;
  readonly availability?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBahrainUniversities = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<BahrainUniversities, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly universityName?: string | null;
  readonly universityNameAr?: string | null;
  readonly isDeactivated?: boolean | null;
  readonly students: AsyncCollection<Student>;
  readonly availability?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type BahrainUniversities = LazyLoading extends LazyLoadingDisabled ? EagerBahrainUniversities : LazyBahrainUniversities

export declare const BahrainUniversities: (new (init: ModelInit<BahrainUniversities>) => BahrainUniversities) & {
  copyOf(source: BahrainUniversities, mutator: (draft: MutableModel<BahrainUniversities>) => MutableModel<BahrainUniversities> | void): BahrainUniversities;
}

type EagerMasterApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterApplication, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly gpa?: number | null;
  readonly verifiedGPA?: number | null;
  readonly status?: Status | keyof typeof Status | null;
  readonly adminLogs?: (AdminLog | null)[] | null;
  readonly masterLogs?: (MasterLog | null)[] | null;
  readonly studentLogs?: (StudentLog | null)[] | null;
  readonly attachment?: MasterAttachment | null;
  readonly program?: string | null;
  readonly dateTime: string;
  readonly isEmailSent?: boolean | null;
  readonly nationalityCategory?: Nationality | keyof typeof Nationality | null;
  readonly universityID: string;
  readonly university?: MasterAppliedUniversities | null;
  readonly studentCPR: string;
  readonly studentName?: string | null;
  readonly student?: Student | null;
  readonly batch?: number | null;
  readonly score?: number | null;
  readonly adminPoints?: number | null;
  readonly processed?: number | null;
  readonly isIncomeVerified?: boolean | null;
  readonly major?: Major | keyof typeof Major | null;
  readonly reason?: string | null;
  readonly income?: Income | keyof typeof Income | null;
  readonly incomeDoc?: string | null;
  readonly toeflIELTSScore?: number | null;
  readonly isToeflIELTSScoreVerified?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly masterApplicationAttachmentId?: string | null;
}

type LazyMasterApplication = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterApplication, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly gpa?: number | null;
  readonly verifiedGPA?: number | null;
  readonly status?: Status | keyof typeof Status | null;
  readonly adminLogs: AsyncCollection<AdminLog>;
  readonly masterLogs: AsyncCollection<MasterLog>;
  readonly studentLogs: AsyncCollection<StudentLog>;
  readonly attachment: AsyncItem<MasterAttachment | undefined>;
  readonly program?: string | null;
  readonly dateTime: string;
  readonly isEmailSent?: boolean | null;
  readonly nationalityCategory?: Nationality | keyof typeof Nationality | null;
  readonly universityID: string;
  readonly university: AsyncItem<MasterAppliedUniversities | undefined>;
  readonly studentCPR: string;
  readonly studentName?: string | null;
  readonly student: AsyncItem<Student | undefined>;
  readonly batch?: number | null;
  readonly score?: number | null;
  readonly adminPoints?: number | null;
  readonly processed?: number | null;
  readonly isIncomeVerified?: boolean | null;
  readonly major?: Major | keyof typeof Major | null;
  readonly reason?: string | null;
  readonly income?: Income | keyof typeof Income | null;
  readonly incomeDoc?: string | null;
  readonly toeflIELTSScore?: number | null;
  readonly isToeflIELTSScoreVerified?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly masterApplicationAttachmentId?: string | null;
}

export declare type MasterApplication = LazyLoading extends LazyLoadingDisabled ? EagerMasterApplication : LazyMasterApplication

export declare const MasterApplication: (new (init: ModelInit<MasterApplication>) => MasterApplication) & {
  copyOf(source: MasterApplication, mutator: (draft: MutableModel<MasterApplication>) => MutableModel<MasterApplication> | void): MasterApplication;
}

type EagerMasterStatistics = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<MasterStatistics, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: number;
  readonly batch: number;
  readonly totalApplications?: number | null;
  readonly totalApplicationsPerStatus?: string | null;
  readonly scoreHistogram?: string | null;
  readonly gpaHistogram?: string | null;
  readonly totalApplicationsPerUniversity?: string | null;
  readonly topUniversities?: string | null;
  readonly topBahrainUniversities?: string | null;
  readonly familyIncome?: string | null;
  readonly universitiesBahrain?: string | null;
  readonly students?: string | null;
  readonly applications?: string | null;
  readonly today?: string | null;
  readonly participatingUniversities?: (string | null)[] | null;
  readonly applicationPerGenderHistogram?: string | null;
  readonly registerAccountsPerGender?: string | null;
  readonly majorsPerGenderHistogram?: string | null;
  readonly incomePerEmploymentStatus?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMasterStatistics = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<MasterStatistics, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: number;
  readonly batch: number;
  readonly totalApplications?: number | null;
  readonly totalApplicationsPerStatus?: string | null;
  readonly scoreHistogram?: string | null;
  readonly gpaHistogram?: string | null;
  readonly totalApplicationsPerUniversity?: string | null;
  readonly topUniversities?: string | null;
  readonly topBahrainUniversities?: string | null;
  readonly familyIncome?: string | null;
  readonly universitiesBahrain?: string | null;
  readonly students?: string | null;
  readonly applications?: string | null;
  readonly today?: string | null;
  readonly participatingUniversities?: (string | null)[] | null;
  readonly applicationPerGenderHistogram?: string | null;
  readonly registerAccountsPerGender?: string | null;
  readonly majorsPerGenderHistogram?: string | null;
  readonly incomePerEmploymentStatus?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MasterStatistics = LazyLoading extends LazyLoadingDisabled ? EagerMasterStatistics : LazyMasterStatistics

export declare const MasterStatistics: (new (init: ModelInit<MasterStatistics>) => MasterStatistics) & {
  copyOf(source: MasterStatistics, mutator: (draft: MutableModel<MasterStatistics>) => MutableModel<MasterStatistics> | void): MasterStatistics;
}

type EagerMasterAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterAttachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cprDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly transcriptDoc?: string | null;
  readonly universityCertificate?: string | null;
  readonly toeflIELTSCertificate?: string | null;
  readonly acceptanceLetterDoc?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMasterAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterAttachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cprDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly transcriptDoc?: string | null;
  readonly universityCertificate?: string | null;
  readonly toeflIELTSCertificate?: string | null;
  readonly acceptanceLetterDoc?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MasterAttachment = LazyLoading extends LazyLoadingDisabled ? EagerMasterAttachment : LazyMasterAttachment

export declare const MasterAttachment: (new (init: ModelInit<MasterAttachment>) => MasterAttachment) & {
  copyOf(source: MasterAttachment, mutator: (draft: MutableModel<MasterAttachment>) => MutableModel<MasterAttachment> | void): MasterAttachment;
}

type EagerMasterAppliedUniversities = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<MasterAppliedUniversities, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly universityName: string;
  readonly universityNameAr: string;
  readonly isDeactivated?: boolean | null;
  readonly applications?: (MasterApplication | null)[] | null;
  readonly availability?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMasterAppliedUniversities = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<MasterAppliedUniversities, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly universityName: string;
  readonly universityNameAr: string;
  readonly isDeactivated?: boolean | null;
  readonly applications: AsyncCollection<MasterApplication>;
  readonly availability?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MasterAppliedUniversities = LazyLoading extends LazyLoadingDisabled ? EagerMasterAppliedUniversities : LazyMasterAppliedUniversities

export declare const MasterAppliedUniversities: (new (init: ModelInit<MasterAppliedUniversities>) => MasterAppliedUniversities) & {
  copyOf(source: MasterAppliedUniversities, mutator: (draft: MutableModel<MasterAppliedUniversities>) => MutableModel<MasterAppliedUniversities> | void): MasterAppliedUniversities;
}

type EagerMasterScholarship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterScholarship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status?: ScholarshipStatus | keyof typeof ScholarshipStatus | null;
  readonly applicationID: string;
  readonly batch?: number | null;
  readonly isConfirmed?: boolean | null;
  readonly application?: MasterApplication | null;
  readonly studentCPR?: string | null;
  readonly unsignedContractDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly studentSignature?: string | null;
  readonly guardianSignature?: string | null;
  readonly bankName?: string | null;
  readonly IBAN?: string | null;
  readonly IBANLetterDoc?: string | null;
  readonly startDate?: string | null;
  readonly scholarshipPeriod?: number | null;
  readonly numberOfSemesters?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMasterScholarship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MasterScholarship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status?: ScholarshipStatus | keyof typeof ScholarshipStatus | null;
  readonly applicationID: string;
  readonly batch?: number | null;
  readonly isConfirmed?: boolean | null;
  readonly application: AsyncItem<MasterApplication | undefined>;
  readonly studentCPR?: string | null;
  readonly unsignedContractDoc?: string | null;
  readonly signedContractDoc?: string | null;
  readonly studentSignature?: string | null;
  readonly guardianSignature?: string | null;
  readonly bankName?: string | null;
  readonly IBAN?: string | null;
  readonly IBANLetterDoc?: string | null;
  readonly startDate?: string | null;
  readonly scholarshipPeriod?: number | null;
  readonly numberOfSemesters?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MasterScholarship = LazyLoading extends LazyLoadingDisabled ? EagerMasterScholarship : LazyMasterScholarship

export declare const MasterScholarship: (new (init: ModelInit<MasterScholarship>) => MasterScholarship) & {
  copyOf(source: MasterScholarship, mutator: (draft: MutableModel<MasterScholarship>) => MutableModel<MasterScholarship> | void): MasterScholarship;
}