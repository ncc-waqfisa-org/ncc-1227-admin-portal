/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAttachmentInput = {
  id?: string | null,
  cprDoc?: string | null,
  signedContractDoc?: string | null,
  transcriptDoc?: string | null,
  schoolCertificate?: string | null,
  _version?: number | null,
};

export type ModelAttachmentConditionInput = {
  cprDoc?: ModelStringInput | null,
  signedContractDoc?: ModelStringInput | null,
  transcriptDoc?: ModelStringInput | null,
  schoolCertificate?: ModelStringInput | null,
  and?: Array< ModelAttachmentConditionInput | null > | null,
  or?: Array< ModelAttachmentConditionInput | null > | null,
  not?: ModelAttachmentConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Attachment = {
  __typename: "Attachment",
  id: string,
  cprDoc?: string | null,
  signedContractDoc?: string | null,
  transcriptDoc?: string | null,
  schoolCertificate?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateAttachmentInput = {
  id: string,
  cprDoc?: string | null,
  signedContractDoc?: string | null,
  transcriptDoc?: string | null,
  schoolCertificate?: string | null,
  _version?: number | null,
};

export type DeleteAttachmentInput = {
  id: string,
  _version?: number | null,
};

export type CreateApplicationInput = {
  id?: string | null,
  gpa?: number | null,
  status?: Status | null,
  attachmentID?: string | null,
  studentCPR: string,
  dateTime: string,
  isEmailSent?: boolean | null,
  schoolName?: string | null,
  schoolType?: SchoolType | null,
  batch?: number | null,
  _version?: number | null,
  applicationAttachmentId?: string | null,
};

export enum Status {
  APPROVED = "APPROVED",
  ELIGIBLE = "ELIGIBLE",
  REVIEW = "REVIEW",
  NOT_COMPLETED = "NOT_COMPLETED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}


export enum SchoolType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}


export type ModelApplicationConditionInput = {
  gpa?: ModelFloatInput | null,
  status?: ModelStatusInput | null,
  attachmentID?: ModelStringInput | null,
  studentCPR?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  isEmailSent?: ModelBooleanInput | null,
  schoolName?: ModelStringInput | null,
  schoolType?: ModelSchoolTypeInput | null,
  batch?: ModelIntInput | null,
  and?: Array< ModelApplicationConditionInput | null > | null,
  or?: Array< ModelApplicationConditionInput | null > | null,
  not?: ModelApplicationConditionInput | null,
  applicationAttachmentId?: ModelIDInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelStatusInput = {
  eq?: Status | null,
  ne?: Status | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelSchoolTypeInput = {
  eq?: SchoolType | null,
  ne?: SchoolType | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Application = {
  __typename: "Application",
  id: string,
  gpa?: number | null,
  status?: Status | null,
  attachmentID?: string | null,
  studentCPR: string,
  adminLogs?: ModelAdminLogConnection | null,
  studentLogs?: ModelStudentLogConnection | null,
  attachment?: Attachment | null,
  programs?: ModelProgramChoiceConnection | null,
  student?: Student | null,
  dateTime: string,
  isEmailSent?: boolean | null,
  schoolName?: string | null,
  schoolType?: SchoolType | null,
  batch?: number | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  applicationAttachmentId?: string | null,
};

export type ModelAdminLogConnection = {
  __typename: "ModelAdminLogConnection",
  items:  Array<AdminLog | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type AdminLog = {
  __typename: "AdminLog",
  id: string,
  applicationID: string,
  adminCPR: string,
  dateTime?: string | null,
  snapshot?: string | null,
  reason?: string | null,
  admin?: Admin | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  applicationAdminLogsId?: string | null,
  adminAdminLogsCpr?: string | null,
};

export type Admin = {
  __typename: "Admin",
  cpr: string,
  fullName?: string | null,
  email?: string | null,
  AdminLogs?: ModelAdminLogConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelStudentLogConnection = {
  __typename: "ModelStudentLogConnection",
  items:  Array<StudentLog | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type StudentLog = {
  __typename: "StudentLog",
  id: string,
  applicationID: string,
  studentCPR: string,
  dateTime?: string | null,
  snapshot?: string | null,
  reason?: string | null,
  student?: Student | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  applicationStudentLogsId?: string | null,
  studentStudentLogsCpr?: string | null,
};

export type Student = {
  __typename: "Student",
  cpr: string,
  cprDoc?: string | null,
  fullName?: string | null,
  email?: string | null,
  phone?: string | null,
  gender?: Gender | null,
  nationality?: string | null,
  schoolName?: string | null,
  schoolType?: SchoolType | null,
  specialization?: string | null,
  placeOfBirth?: string | null,
  studentOrderAmongSiblings?: number | null,
  householdIncome?: number | null,
  familyIncome?: FamilyIncome | null,
  familyIncomeProofDoc?: string | null,
  familyIncomeProofDocs?: Array< string | null > | null,
  preferredLanguage?: Language | null,
  graduationDate?: string | null,
  address?: string | null,
  applications?: ModelApplicationConnection | null,
  ParentInfo?: ParentInfo | null,
  parentInfoID?: string | null,
  StudentLogs?: ModelStudentLogConnection | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}


export enum FamilyIncome {
  LESS_THAN_500 = "LESS_THAN_500",
  BETWEEN_500_AND_700 = "BETWEEN_500_AND_700",
  BETWEEN_700_AND_1000 = "BETWEEN_700_AND_1000",
  OVER_1000 = "OVER_1000",
}


export enum Language {
  ARABIC = "ARABIC",
  ENGLISH = "ENGLISH",
}


export type ModelApplicationConnection = {
  __typename: "ModelApplicationConnection",
  items:  Array<Application | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ParentInfo = {
  __typename: "ParentInfo",
  id: string,
  guardianFullName?: string | null,
  relation?: string | null,
  guardianCPR?: string | null,
  primaryMobile?: string | null,
  secondaryMobile?: string | null,
  fatherFullName?: string | null,
  fatherCPR?: string | null,
  motherFullName?: string | null,
  motherCPR?: string | null,
  numberOfFamilyMembers?: number | null,
  address?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelProgramChoiceConnection = {
  __typename: "ModelProgramChoiceConnection",
  items:  Array<ProgramChoice | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ProgramChoice = {
  __typename: "ProgramChoice",
  id: string,
  programID: string,
  applicationID: string,
  program?: Program | null,
  application?: Application | null,
  choiceOrder?: number | null,
  acceptanceLetterDoc?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  applicationProgramsId?: string | null,
  programApplicationsId?: string | null,
};

export type Program = {
  __typename: "Program",
  id: string,
  name?: string | null,
  requirements?: string | null,
  nameAr?: string | null,
  requirementsAr?: string | null,
  availability?: number | null,
  universityID: string,
  university?: University | null,
  applications?: ModelProgramChoiceConnection | null,
  isDeactivated?: boolean | null,
  isTrashed?: boolean | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  universityProgramsId?: string | null,
};

export type University = {
  __typename: "University",
  id: string,
  name?: string | null,
  nameAr?: string | null,
  Programs?: ModelProgramConnection | null,
  availability?: number | null,
  isDeactivated?: boolean | null,
  isTrashed?: boolean | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelProgramConnection = {
  __typename: "ModelProgramConnection",
  items:  Array<Program | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type UpdateApplicationInput = {
  id: string,
  gpa?: number | null,
  status?: Status | null,
  attachmentID?: string | null,
  studentCPR?: string | null,
  dateTime?: string | null,
  isEmailSent?: boolean | null,
  schoolName?: string | null,
  schoolType?: SchoolType | null,
  batch?: number | null,
  _version?: number | null,
  applicationAttachmentId?: string | null,
};

export type DeleteApplicationInput = {
  id: string,
  _version?: number | null,
};

export type CreateProgramChoiceInput = {
  id?: string | null,
  programID: string,
  applicationID: string,
  choiceOrder?: number | null,
  acceptanceLetterDoc?: string | null,
  _version?: number | null,
  applicationProgramsId?: string | null,
  programApplicationsId?: string | null,
};

export type ModelProgramChoiceConditionInput = {
  programID?: ModelIDInput | null,
  applicationID?: ModelIDInput | null,
  choiceOrder?: ModelIntInput | null,
  acceptanceLetterDoc?: ModelStringInput | null,
  and?: Array< ModelProgramChoiceConditionInput | null > | null,
  or?: Array< ModelProgramChoiceConditionInput | null > | null,
  not?: ModelProgramChoiceConditionInput | null,
  applicationProgramsId?: ModelIDInput | null,
  programApplicationsId?: ModelIDInput | null,
};

export type UpdateProgramChoiceInput = {
  id: string,
  programID?: string | null,
  applicationID?: string | null,
  choiceOrder?: number | null,
  acceptanceLetterDoc?: string | null,
  _version?: number | null,
  applicationProgramsId?: string | null,
  programApplicationsId?: string | null,
};

export type DeleteProgramChoiceInput = {
  id: string,
  _version?: number | null,
};

export type CreateProgramInput = {
  id?: string | null,
  name?: string | null,
  requirements?: string | null,
  nameAr?: string | null,
  requirementsAr?: string | null,
  availability?: number | null,
  universityID: string,
  isDeactivated?: boolean | null,
  isTrashed?: boolean | null,
  _version?: number | null,
  universityProgramsId?: string | null,
};

export type ModelProgramConditionInput = {
  name?: ModelStringInput | null,
  requirements?: ModelStringInput | null,
  nameAr?: ModelStringInput | null,
  requirementsAr?: ModelStringInput | null,
  availability?: ModelIntInput | null,
  universityID?: ModelIDInput | null,
  isDeactivated?: ModelBooleanInput | null,
  isTrashed?: ModelBooleanInput | null,
  and?: Array< ModelProgramConditionInput | null > | null,
  or?: Array< ModelProgramConditionInput | null > | null,
  not?: ModelProgramConditionInput | null,
  universityProgramsId?: ModelIDInput | null,
};

export type UpdateProgramInput = {
  id: string,
  name?: string | null,
  requirements?: string | null,
  nameAr?: string | null,
  requirementsAr?: string | null,
  availability?: number | null,
  universityID?: string | null,
  isDeactivated?: boolean | null,
  isTrashed?: boolean | null,
  _version?: number | null,
  universityProgramsId?: string | null,
};

export type DeleteProgramInput = {
  id: string,
  _version?: number | null,
};

export type CreateUniversityInput = {
  id?: string | null,
  name?: string | null,
  nameAr?: string | null,
  availability?: number | null,
  isDeactivated?: boolean | null,
  isTrashed?: boolean | null,
  _version?: number | null,
};

export type ModelUniversityConditionInput = {
  name?: ModelStringInput | null,
  nameAr?: ModelStringInput | null,
  availability?: ModelIntInput | null,
  isDeactivated?: ModelBooleanInput | null,
  isTrashed?: ModelBooleanInput | null,
  and?: Array< ModelUniversityConditionInput | null > | null,
  or?: Array< ModelUniversityConditionInput | null > | null,
  not?: ModelUniversityConditionInput | null,
};

export type UpdateUniversityInput = {
  id: string,
  name?: string | null,
  nameAr?: string | null,
  availability?: number | null,
  isDeactivated?: boolean | null,
  isTrashed?: boolean | null,
  _version?: number | null,
};

export type DeleteUniversityInput = {
  id: string,
  _version?: number | null,
};

export type CreateAdminLogInput = {
  id?: string | null,
  applicationID: string,
  adminCPR: string,
  dateTime?: string | null,
  snapshot?: string | null,
  reason?: string | null,
  _version?: number | null,
  applicationAdminLogsId?: string | null,
  adminAdminLogsCpr?: string | null,
};

export type ModelAdminLogConditionInput = {
  applicationID?: ModelIDInput | null,
  adminCPR?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  snapshot?: ModelStringInput | null,
  reason?: ModelStringInput | null,
  and?: Array< ModelAdminLogConditionInput | null > | null,
  or?: Array< ModelAdminLogConditionInput | null > | null,
  not?: ModelAdminLogConditionInput | null,
  applicationAdminLogsId?: ModelIDInput | null,
  adminAdminLogsCpr?: ModelStringInput | null,
};

export type UpdateAdminLogInput = {
  id: string,
  applicationID?: string | null,
  adminCPR?: string | null,
  dateTime?: string | null,
  snapshot?: string | null,
  reason?: string | null,
  _version?: number | null,
  applicationAdminLogsId?: string | null,
  adminAdminLogsCpr?: string | null,
};

export type DeleteAdminLogInput = {
  id: string,
  _version?: number | null,
};

export type CreateStudentLogInput = {
  id?: string | null,
  applicationID: string,
  studentCPR: string,
  dateTime?: string | null,
  snapshot?: string | null,
  reason?: string | null,
  _version?: number | null,
  applicationStudentLogsId?: string | null,
  studentStudentLogsCpr?: string | null,
};

export type ModelStudentLogConditionInput = {
  applicationID?: ModelIDInput | null,
  studentCPR?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  snapshot?: ModelStringInput | null,
  reason?: ModelStringInput | null,
  and?: Array< ModelStudentLogConditionInput | null > | null,
  or?: Array< ModelStudentLogConditionInput | null > | null,
  not?: ModelStudentLogConditionInput | null,
  applicationStudentLogsId?: ModelIDInput | null,
  studentStudentLogsCpr?: ModelStringInput | null,
};

export type UpdateStudentLogInput = {
  id: string,
  applicationID?: string | null,
  studentCPR?: string | null,
  dateTime?: string | null,
  snapshot?: string | null,
  reason?: string | null,
  _version?: number | null,
  applicationStudentLogsId?: string | null,
  studentStudentLogsCpr?: string | null,
};

export type DeleteStudentLogInput = {
  id: string,
  _version?: number | null,
};

export type CreateAdminInput = {
  cpr: string,
  fullName?: string | null,
  email?: string | null,
  _version?: number | null,
};

export type ModelAdminConditionInput = {
  fullName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelAdminConditionInput | null > | null,
  or?: Array< ModelAdminConditionInput | null > | null,
  not?: ModelAdminConditionInput | null,
};

export type UpdateAdminInput = {
  cpr: string,
  fullName?: string | null,
  email?: string | null,
  _version?: number | null,
};

export type DeleteAdminInput = {
  cpr: string,
  _version?: number | null,
};

export type CreateParentInfoInput = {
  id?: string | null,
  guardianFullName?: string | null,
  relation?: string | null,
  guardianCPR?: string | null,
  primaryMobile?: string | null,
  secondaryMobile?: string | null,
  fatherFullName?: string | null,
  fatherCPR?: string | null,
  motherFullName?: string | null,
  motherCPR?: string | null,
  numberOfFamilyMembers?: number | null,
  address?: string | null,
  _version?: number | null,
};

export type ModelParentInfoConditionInput = {
  guardianFullName?: ModelStringInput | null,
  relation?: ModelStringInput | null,
  guardianCPR?: ModelStringInput | null,
  primaryMobile?: ModelStringInput | null,
  secondaryMobile?: ModelStringInput | null,
  fatherFullName?: ModelStringInput | null,
  fatherCPR?: ModelStringInput | null,
  motherFullName?: ModelStringInput | null,
  motherCPR?: ModelStringInput | null,
  numberOfFamilyMembers?: ModelIntInput | null,
  address?: ModelStringInput | null,
  and?: Array< ModelParentInfoConditionInput | null > | null,
  or?: Array< ModelParentInfoConditionInput | null > | null,
  not?: ModelParentInfoConditionInput | null,
};

export type UpdateParentInfoInput = {
  id: string,
  guardianFullName?: string | null,
  relation?: string | null,
  guardianCPR?: string | null,
  primaryMobile?: string | null,
  secondaryMobile?: string | null,
  fatherFullName?: string | null,
  fatherCPR?: string | null,
  motherFullName?: string | null,
  motherCPR?: string | null,
  numberOfFamilyMembers?: number | null,
  address?: string | null,
  _version?: number | null,
};

export type DeleteParentInfoInput = {
  id: string,
  _version?: number | null,
};

export type CreateStudentInput = {
  cpr: string,
  cprDoc?: string | null,
  fullName?: string | null,
  email?: string | null,
  phone?: string | null,
  gender?: Gender | null,
  nationality?: string | null,
  schoolName?: string | null,
  schoolType?: SchoolType | null,
  specialization?: string | null,
  placeOfBirth?: string | null,
  studentOrderAmongSiblings?: number | null,
  householdIncome?: number | null,
  familyIncome?: FamilyIncome | null,
  familyIncomeProofDoc?: string | null,
  familyIncomeProofDocs?: Array< string | null > | null,
  preferredLanguage?: Language | null,
  graduationDate?: string | null,
  address?: string | null,
  parentInfoID?: string | null,
  _version?: number | null,
};

export type ModelStudentConditionInput = {
  cprDoc?: ModelStringInput | null,
  fullName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  gender?: ModelGenderInput | null,
  nationality?: ModelStringInput | null,
  schoolName?: ModelStringInput | null,
  schoolType?: ModelSchoolTypeInput | null,
  specialization?: ModelStringInput | null,
  placeOfBirth?: ModelStringInput | null,
  studentOrderAmongSiblings?: ModelIntInput | null,
  householdIncome?: ModelFloatInput | null,
  familyIncome?: ModelFamilyIncomeInput | null,
  familyIncomeProofDoc?: ModelStringInput | null,
  familyIncomeProofDocs?: ModelStringInput | null,
  preferredLanguage?: ModelLanguageInput | null,
  graduationDate?: ModelStringInput | null,
  address?: ModelStringInput | null,
  parentInfoID?: ModelIDInput | null,
  and?: Array< ModelStudentConditionInput | null > | null,
  or?: Array< ModelStudentConditionInput | null > | null,
  not?: ModelStudentConditionInput | null,
};

export type ModelGenderInput = {
  eq?: Gender | null,
  ne?: Gender | null,
};

export type ModelFamilyIncomeInput = {
  eq?: FamilyIncome | null,
  ne?: FamilyIncome | null,
};

export type ModelLanguageInput = {
  eq?: Language | null,
  ne?: Language | null,
};

export type UpdateStudentInput = {
  cpr: string,
  cprDoc?: string | null,
  fullName?: string | null,
  email?: string | null,
  phone?: string | null,
  gender?: Gender | null,
  nationality?: string | null,
  schoolName?: string | null,
  schoolType?: SchoolType | null,
  specialization?: string | null,
  placeOfBirth?: string | null,
  studentOrderAmongSiblings?: number | null,
  householdIncome?: number | null,
  familyIncome?: FamilyIncome | null,
  familyIncomeProofDoc?: string | null,
  familyIncomeProofDocs?: Array< string | null > | null,
  preferredLanguage?: Language | null,
  graduationDate?: string | null,
  address?: string | null,
  parentInfoID?: string | null,
  _version?: number | null,
};

export type DeleteStudentInput = {
  cpr: string,
  _version?: number | null,
};

export type ModelAttachmentFilterInput = {
  id?: ModelIDInput | null,
  cprDoc?: ModelStringInput | null,
  signedContractDoc?: ModelStringInput | null,
  transcriptDoc?: ModelStringInput | null,
  schoolCertificate?: ModelStringInput | null,
  and?: Array< ModelAttachmentFilterInput | null > | null,
  or?: Array< ModelAttachmentFilterInput | null > | null,
  not?: ModelAttachmentFilterInput | null,
};

export type ModelAttachmentConnection = {
  __typename: "ModelAttachmentConnection",
  items:  Array<Attachment | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelApplicationFilterInput = {
  id?: ModelIDInput | null,
  gpa?: ModelFloatInput | null,
  status?: ModelStatusInput | null,
  attachmentID?: ModelStringInput | null,
  studentCPR?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  isEmailSent?: ModelBooleanInput | null,
  schoolName?: ModelStringInput | null,
  schoolType?: ModelSchoolTypeInput | null,
  batch?: ModelIntInput | null,
  and?: Array< ModelApplicationFilterInput | null > | null,
  or?: Array< ModelApplicationFilterInput | null > | null,
  not?: ModelApplicationFilterInput | null,
  applicationAttachmentId?: ModelIDInput | null,
};

export type ModelProgramChoiceFilterInput = {
  id?: ModelIDInput | null,
  programID?: ModelIDInput | null,
  applicationID?: ModelIDInput | null,
  choiceOrder?: ModelIntInput | null,
  acceptanceLetterDoc?: ModelStringInput | null,
  and?: Array< ModelProgramChoiceFilterInput | null > | null,
  or?: Array< ModelProgramChoiceFilterInput | null > | null,
  not?: ModelProgramChoiceFilterInput | null,
  applicationProgramsId?: ModelIDInput | null,
  programApplicationsId?: ModelIDInput | null,
};

export type ModelProgramFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  requirements?: ModelStringInput | null,
  nameAr?: ModelStringInput | null,
  requirementsAr?: ModelStringInput | null,
  availability?: ModelIntInput | null,
  universityID?: ModelIDInput | null,
  isDeactivated?: ModelBooleanInput | null,
  isTrashed?: ModelBooleanInput | null,
  and?: Array< ModelProgramFilterInput | null > | null,
  or?: Array< ModelProgramFilterInput | null > | null,
  not?: ModelProgramFilterInput | null,
  universityProgramsId?: ModelIDInput | null,
};

export type ModelUniversityFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  nameAr?: ModelStringInput | null,
  availability?: ModelIntInput | null,
  isDeactivated?: ModelBooleanInput | null,
  isTrashed?: ModelBooleanInput | null,
  and?: Array< ModelUniversityFilterInput | null > | null,
  or?: Array< ModelUniversityFilterInput | null > | null,
  not?: ModelUniversityFilterInput | null,
};

export type ModelUniversityConnection = {
  __typename: "ModelUniversityConnection",
  items:  Array<University | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelAdminLogFilterInput = {
  id?: ModelIDInput | null,
  applicationID?: ModelIDInput | null,
  adminCPR?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  snapshot?: ModelStringInput | null,
  reason?: ModelStringInput | null,
  and?: Array< ModelAdminLogFilterInput | null > | null,
  or?: Array< ModelAdminLogFilterInput | null > | null,
  not?: ModelAdminLogFilterInput | null,
  applicationAdminLogsId?: ModelIDInput | null,
  adminAdminLogsCpr?: ModelStringInput | null,
};

export type ModelStudentLogFilterInput = {
  id?: ModelIDInput | null,
  applicationID?: ModelIDInput | null,
  studentCPR?: ModelStringInput | null,
  dateTime?: ModelStringInput | null,
  snapshot?: ModelStringInput | null,
  reason?: ModelStringInput | null,
  and?: Array< ModelStudentLogFilterInput | null > | null,
  or?: Array< ModelStudentLogFilterInput | null > | null,
  not?: ModelStudentLogFilterInput | null,
  applicationStudentLogsId?: ModelIDInput | null,
  studentStudentLogsCpr?: ModelStringInput | null,
};

export type ModelAdminFilterInput = {
  cpr?: ModelStringInput | null,
  fullName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelAdminFilterInput | null > | null,
  or?: Array< ModelAdminFilterInput | null > | null,
  not?: ModelAdminFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelAdminConnection = {
  __typename: "ModelAdminConnection",
  items:  Array<Admin | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelParentInfoFilterInput = {
  id?: ModelIDInput | null,
  guardianFullName?: ModelStringInput | null,
  relation?: ModelStringInput | null,
  guardianCPR?: ModelStringInput | null,
  primaryMobile?: ModelStringInput | null,
  secondaryMobile?: ModelStringInput | null,
  fatherFullName?: ModelStringInput | null,
  fatherCPR?: ModelStringInput | null,
  motherFullName?: ModelStringInput | null,
  motherCPR?: ModelStringInput | null,
  numberOfFamilyMembers?: ModelIntInput | null,
  address?: ModelStringInput | null,
  and?: Array< ModelParentInfoFilterInput | null > | null,
  or?: Array< ModelParentInfoFilterInput | null > | null,
  not?: ModelParentInfoFilterInput | null,
};

export type ModelParentInfoConnection = {
  __typename: "ModelParentInfoConnection",
  items:  Array<ParentInfo | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelStudentFilterInput = {
  cpr?: ModelStringInput | null,
  cprDoc?: ModelStringInput | null,
  fullName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  gender?: ModelGenderInput | null,
  nationality?: ModelStringInput | null,
  schoolName?: ModelStringInput | null,
  schoolType?: ModelSchoolTypeInput | null,
  specialization?: ModelStringInput | null,
  placeOfBirth?: ModelStringInput | null,
  studentOrderAmongSiblings?: ModelIntInput | null,
  householdIncome?: ModelFloatInput | null,
  familyIncome?: ModelFamilyIncomeInput | null,
  familyIncomeProofDoc?: ModelStringInput | null,
  familyIncomeProofDocs?: ModelStringInput | null,
  preferredLanguage?: ModelLanguageInput | null,
  graduationDate?: ModelStringInput | null,
  address?: ModelStringInput | null,
  parentInfoID?: ModelIDInput | null,
  and?: Array< ModelStudentFilterInput | null > | null,
  or?: Array< ModelStudentFilterInput | null > | null,
  not?: ModelStudentFilterInput | null,
};

export type ModelStudentConnection = {
  __typename: "ModelStudentConnection",
  items:  Array<Student | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelFloatKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelSubscriptionAttachmentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  cprDoc?: ModelSubscriptionStringInput | null,
  signedContractDoc?: ModelSubscriptionStringInput | null,
  transcriptDoc?: ModelSubscriptionStringInput | null,
  schoolCertificate?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAttachmentFilterInput | null > | null,
  or?: Array< ModelSubscriptionAttachmentFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionApplicationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  gpa?: ModelSubscriptionFloatInput | null,
  status?: ModelSubscriptionStringInput | null,
  attachmentID?: ModelSubscriptionStringInput | null,
  studentCPR?: ModelSubscriptionStringInput | null,
  dateTime?: ModelSubscriptionStringInput | null,
  isEmailSent?: ModelSubscriptionBooleanInput | null,
  schoolName?: ModelSubscriptionStringInput | null,
  schoolType?: ModelSubscriptionStringInput | null,
  batch?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionApplicationFilterInput | null > | null,
  or?: Array< ModelSubscriptionApplicationFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionProgramChoiceFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  programID?: ModelSubscriptionIDInput | null,
  applicationID?: ModelSubscriptionIDInput | null,
  choiceOrder?: ModelSubscriptionIntInput | null,
  acceptanceLetterDoc?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProgramChoiceFilterInput | null > | null,
  or?: Array< ModelSubscriptionProgramChoiceFilterInput | null > | null,
};

export type ModelSubscriptionProgramFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  requirements?: ModelSubscriptionStringInput | null,
  nameAr?: ModelSubscriptionStringInput | null,
  requirementsAr?: ModelSubscriptionStringInput | null,
  availability?: ModelSubscriptionIntInput | null,
  universityID?: ModelSubscriptionIDInput | null,
  isDeactivated?: ModelSubscriptionBooleanInput | null,
  isTrashed?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionProgramFilterInput | null > | null,
  or?: Array< ModelSubscriptionProgramFilterInput | null > | null,
};

export type ModelSubscriptionUniversityFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  nameAr?: ModelSubscriptionStringInput | null,
  availability?: ModelSubscriptionIntInput | null,
  isDeactivated?: ModelSubscriptionBooleanInput | null,
  isTrashed?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionUniversityFilterInput | null > | null,
  or?: Array< ModelSubscriptionUniversityFilterInput | null > | null,
};

export type ModelSubscriptionAdminLogFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  applicationID?: ModelSubscriptionIDInput | null,
  adminCPR?: ModelSubscriptionStringInput | null,
  dateTime?: ModelSubscriptionStringInput | null,
  snapshot?: ModelSubscriptionStringInput | null,
  reason?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAdminLogFilterInput | null > | null,
  or?: Array< ModelSubscriptionAdminLogFilterInput | null > | null,
};

export type ModelSubscriptionStudentLogFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  applicationID?: ModelSubscriptionIDInput | null,
  studentCPR?: ModelSubscriptionStringInput | null,
  dateTime?: ModelSubscriptionStringInput | null,
  snapshot?: ModelSubscriptionStringInput | null,
  reason?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionStudentLogFilterInput | null > | null,
  or?: Array< ModelSubscriptionStudentLogFilterInput | null > | null,
};

export type ModelSubscriptionAdminFilterInput = {
  cpr?: ModelSubscriptionStringInput | null,
  fullName?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAdminFilterInput | null > | null,
  or?: Array< ModelSubscriptionAdminFilterInput | null > | null,
};

export type ModelSubscriptionParentInfoFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  guardianFullName?: ModelSubscriptionStringInput | null,
  relation?: ModelSubscriptionStringInput | null,
  guardianCPR?: ModelSubscriptionStringInput | null,
  primaryMobile?: ModelSubscriptionStringInput | null,
  secondaryMobile?: ModelSubscriptionStringInput | null,
  fatherFullName?: ModelSubscriptionStringInput | null,
  fatherCPR?: ModelSubscriptionStringInput | null,
  motherFullName?: ModelSubscriptionStringInput | null,
  motherCPR?: ModelSubscriptionStringInput | null,
  numberOfFamilyMembers?: ModelSubscriptionIntInput | null,
  address?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionParentInfoFilterInput | null > | null,
  or?: Array< ModelSubscriptionParentInfoFilterInput | null > | null,
};

export type ModelSubscriptionStudentFilterInput = {
  cpr?: ModelSubscriptionStringInput | null,
  cprDoc?: ModelSubscriptionStringInput | null,
  fullName?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  phone?: ModelSubscriptionStringInput | null,
  gender?: ModelSubscriptionStringInput | null,
  nationality?: ModelSubscriptionStringInput | null,
  schoolName?: ModelSubscriptionStringInput | null,
  schoolType?: ModelSubscriptionStringInput | null,
  specialization?: ModelSubscriptionStringInput | null,
  placeOfBirth?: ModelSubscriptionStringInput | null,
  studentOrderAmongSiblings?: ModelSubscriptionIntInput | null,
  householdIncome?: ModelSubscriptionFloatInput | null,
  familyIncome?: ModelSubscriptionStringInput | null,
  familyIncomeProofDoc?: ModelSubscriptionStringInput | null,
  familyIncomeProofDocs?: ModelSubscriptionStringInput | null,
  preferredLanguage?: ModelSubscriptionStringInput | null,
  graduationDate?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  parentInfoID?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionStudentFilterInput | null > | null,
  or?: Array< ModelSubscriptionStudentFilterInput | null > | null,
};

export type CreateAttachmentMutationVariables = {
  input: CreateAttachmentInput,
  condition?: ModelAttachmentConditionInput | null,
};

export type CreateAttachmentMutation = {
  createAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateAttachmentMutationVariables = {
  input: UpdateAttachmentInput,
  condition?: ModelAttachmentConditionInput | null,
};

export type UpdateAttachmentMutation = {
  updateAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteAttachmentMutationVariables = {
  input: DeleteAttachmentInput,
  condition?: ModelAttachmentConditionInput | null,
};

export type DeleteAttachmentMutation = {
  deleteAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateApplicationMutationVariables = {
  input: CreateApplicationInput,
  condition?: ModelApplicationConditionInput | null,
};

export type CreateApplicationMutation = {
  createApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type UpdateApplicationMutationVariables = {
  input: UpdateApplicationInput,
  condition?: ModelApplicationConditionInput | null,
};

export type UpdateApplicationMutation = {
  updateApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type DeleteApplicationMutationVariables = {
  input: DeleteApplicationInput,
  condition?: ModelApplicationConditionInput | null,
};

export type DeleteApplicationMutation = {
  deleteApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type CreateProgramChoiceMutationVariables = {
  input: CreateProgramChoiceInput,
  condition?: ModelProgramChoiceConditionInput | null,
};

export type CreateProgramChoiceMutation = {
  createProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type UpdateProgramChoiceMutationVariables = {
  input: UpdateProgramChoiceInput,
  condition?: ModelProgramChoiceConditionInput | null,
};

export type UpdateProgramChoiceMutation = {
  updateProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type DeleteProgramChoiceMutationVariables = {
  input: DeleteProgramChoiceInput,
  condition?: ModelProgramChoiceConditionInput | null,
};

export type DeleteProgramChoiceMutation = {
  deleteProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type CreateProgramMutationVariables = {
  input: CreateProgramInput,
  condition?: ModelProgramConditionInput | null,
};

export type CreateProgramMutation = {
  createProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type UpdateProgramMutationVariables = {
  input: UpdateProgramInput,
  condition?: ModelProgramConditionInput | null,
};

export type UpdateProgramMutation = {
  updateProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type DeleteProgramMutationVariables = {
  input: DeleteProgramInput,
  condition?: ModelProgramConditionInput | null,
};

export type DeleteProgramMutation = {
  deleteProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type CreateUniversityMutationVariables = {
  input: CreateUniversityInput,
  condition?: ModelUniversityConditionInput | null,
};

export type CreateUniversityMutation = {
  createUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateUniversityMutationVariables = {
  input: UpdateUniversityInput,
  condition?: ModelUniversityConditionInput | null,
};

export type UpdateUniversityMutation = {
  updateUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteUniversityMutationVariables = {
  input: DeleteUniversityInput,
  condition?: ModelUniversityConditionInput | null,
};

export type DeleteUniversityMutation = {
  deleteUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateAdminLogMutationVariables = {
  input: CreateAdminLogInput,
  condition?: ModelAdminLogConditionInput | null,
};

export type CreateAdminLogMutation = {
  createAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type UpdateAdminLogMutationVariables = {
  input: UpdateAdminLogInput,
  condition?: ModelAdminLogConditionInput | null,
};

export type UpdateAdminLogMutation = {
  updateAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type DeleteAdminLogMutationVariables = {
  input: DeleteAdminLogInput,
  condition?: ModelAdminLogConditionInput | null,
};

export type DeleteAdminLogMutation = {
  deleteAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type CreateStudentLogMutationVariables = {
  input: CreateStudentLogInput,
  condition?: ModelStudentLogConditionInput | null,
};

export type CreateStudentLogMutation = {
  createStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type UpdateStudentLogMutationVariables = {
  input: UpdateStudentLogInput,
  condition?: ModelStudentLogConditionInput | null,
};

export type UpdateStudentLogMutation = {
  updateStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type DeleteStudentLogMutationVariables = {
  input: DeleteStudentLogInput,
  condition?: ModelStudentLogConditionInput | null,
};

export type DeleteStudentLogMutation = {
  deleteStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type CreateAdminMutationVariables = {
  input: CreateAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type CreateAdminMutation = {
  createAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateAdminMutationVariables = {
  input: UpdateAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type UpdateAdminMutation = {
  updateAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteAdminMutationVariables = {
  input: DeleteAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type DeleteAdminMutation = {
  deleteAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateParentInfoMutationVariables = {
  input: CreateParentInfoInput,
  condition?: ModelParentInfoConditionInput | null,
};

export type CreateParentInfoMutation = {
  createParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateParentInfoMutationVariables = {
  input: UpdateParentInfoInput,
  condition?: ModelParentInfoConditionInput | null,
};

export type UpdateParentInfoMutation = {
  updateParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteParentInfoMutationVariables = {
  input: DeleteParentInfoInput,
  condition?: ModelParentInfoConditionInput | null,
};

export type DeleteParentInfoMutation = {
  deleteParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateStudentMutationVariables = {
  input: CreateStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type CreateStudentMutation = {
  createStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateStudentMutationVariables = {
  input: UpdateStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type UpdateStudentMutation = {
  updateStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteStudentMutationVariables = {
  input: DeleteStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type DeleteStudentMutation = {
  deleteStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type GetAttachmentQueryVariables = {
  id: string,
};

export type GetAttachmentQuery = {
  getAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListAttachmentsQueryVariables = {
  filter?: ModelAttachmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttachmentsQuery = {
  listAttachments?:  {
    __typename: "ModelAttachmentConnection",
    items:  Array< {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncAttachmentsQueryVariables = {
  filter?: ModelAttachmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncAttachmentsQuery = {
  syncAttachments?:  {
    __typename: "ModelAttachmentConnection",
    items:  Array< {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetApplicationQueryVariables = {
  id: string,
};

export type GetApplicationQuery = {
  getApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type ListApplicationsQueryVariables = {
  filter?: ModelApplicationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListApplicationsQuery = {
  listApplications?:  {
    __typename: "ModelApplicationConnection",
    items:  Array< {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncApplicationsQueryVariables = {
  filter?: ModelApplicationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncApplicationsQuery = {
  syncApplications?:  {
    __typename: "ModelApplicationConnection",
    items:  Array< {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetProgramChoiceQueryVariables = {
  id: string,
};

export type GetProgramChoiceQuery = {
  getProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type ListProgramChoicesQueryVariables = {
  filter?: ModelProgramChoiceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProgramChoicesQuery = {
  listProgramChoices?:  {
    __typename: "ModelProgramChoiceConnection",
    items:  Array< {
      __typename: "ProgramChoice",
      id: string,
      programID: string,
      applicationID: string,
      choiceOrder?: number | null,
      acceptanceLetterDoc?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationProgramsId?: string | null,
      programApplicationsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncProgramChoicesQueryVariables = {
  filter?: ModelProgramChoiceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncProgramChoicesQuery = {
  syncProgramChoices?:  {
    __typename: "ModelProgramChoiceConnection",
    items:  Array< {
      __typename: "ProgramChoice",
      id: string,
      programID: string,
      applicationID: string,
      choiceOrder?: number | null,
      acceptanceLetterDoc?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationProgramsId?: string | null,
      programApplicationsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetProgramQueryVariables = {
  id: string,
};

export type GetProgramQuery = {
  getProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type ListProgramsQueryVariables = {
  filter?: ModelProgramFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProgramsQuery = {
  listPrograms?:  {
    __typename: "ModelProgramConnection",
    items:  Array< {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncProgramsQueryVariables = {
  filter?: ModelProgramFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncProgramsQuery = {
  syncPrograms?:  {
    __typename: "ModelProgramConnection",
    items:  Array< {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetUniversityQueryVariables = {
  id: string,
};

export type GetUniversityQuery = {
  getUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListUniversitiesQueryVariables = {
  filter?: ModelUniversityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUniversitiesQuery = {
  listUniversities?:  {
    __typename: "ModelUniversityConnection",
    items:  Array< {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncUniversitiesQueryVariables = {
  filter?: ModelUniversityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUniversitiesQuery = {
  syncUniversities?:  {
    __typename: "ModelUniversityConnection",
    items:  Array< {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetAdminLogQueryVariables = {
  id: string,
};

export type GetAdminLogQuery = {
  getAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type ListAdminLogsQueryVariables = {
  filter?: ModelAdminLogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAdminLogsQuery = {
  listAdminLogs?:  {
    __typename: "ModelAdminLogConnection",
    items:  Array< {
      __typename: "AdminLog",
      id: string,
      applicationID: string,
      adminCPR: string,
      dateTime?: string | null,
      snapshot?: string | null,
      reason?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAdminLogsId?: string | null,
      adminAdminLogsCpr?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncAdminLogsQueryVariables = {
  filter?: ModelAdminLogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncAdminLogsQuery = {
  syncAdminLogs?:  {
    __typename: "ModelAdminLogConnection",
    items:  Array< {
      __typename: "AdminLog",
      id: string,
      applicationID: string,
      adminCPR: string,
      dateTime?: string | null,
      snapshot?: string | null,
      reason?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAdminLogsId?: string | null,
      adminAdminLogsCpr?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetStudentLogQueryVariables = {
  id: string,
};

export type GetStudentLogQuery = {
  getStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type ListStudentLogsQueryVariables = {
  filter?: ModelStudentLogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStudentLogsQuery = {
  listStudentLogs?:  {
    __typename: "ModelStudentLogConnection",
    items:  Array< {
      __typename: "StudentLog",
      id: string,
      applicationID: string,
      studentCPR: string,
      dateTime?: string | null,
      snapshot?: string | null,
      reason?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationStudentLogsId?: string | null,
      studentStudentLogsCpr?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncStudentLogsQueryVariables = {
  filter?: ModelStudentLogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncStudentLogsQuery = {
  syncStudentLogs?:  {
    __typename: "ModelStudentLogConnection",
    items:  Array< {
      __typename: "StudentLog",
      id: string,
      applicationID: string,
      studentCPR: string,
      dateTime?: string | null,
      snapshot?: string | null,
      reason?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationStudentLogsId?: string | null,
      studentStudentLogsCpr?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetAdminQueryVariables = {
  cpr: string,
};

export type GetAdminQuery = {
  getAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListAdminsQueryVariables = {
  cpr?: string | null,
  filter?: ModelAdminFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAdminsQuery = {
  listAdmins?:  {
    __typename: "ModelAdminConnection",
    items:  Array< {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncAdminsQueryVariables = {
  filter?: ModelAdminFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncAdminsQuery = {
  syncAdmins?:  {
    __typename: "ModelAdminConnection",
    items:  Array< {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetParentInfoQueryVariables = {
  id: string,
};

export type GetParentInfoQuery = {
  getParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListParentInfosQueryVariables = {
  filter?: ModelParentInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListParentInfosQuery = {
  listParentInfos?:  {
    __typename: "ModelParentInfoConnection",
    items:  Array< {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncParentInfosQueryVariables = {
  filter?: ModelParentInfoFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncParentInfosQuery = {
  syncParentInfos?:  {
    __typename: "ModelParentInfoConnection",
    items:  Array< {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetStudentQueryVariables = {
  cpr: string,
};

export type GetStudentQuery = {
  getStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListStudentsQueryVariables = {
  cpr?: string | null,
  filter?: ModelStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListStudentsQuery = {
  listStudents?:  {
    __typename: "ModelStudentConnection",
    items:  Array< {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncStudentsQueryVariables = {
  filter?: ModelStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncStudentsQuery = {
  syncStudents?:  {
    __typename: "ModelStudentConnection",
    items:  Array< {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ApplicationsByIdAndDateTimeQueryVariables = {
  id: string,
  dateTime?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelApplicationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ApplicationsByIdAndDateTimeQuery = {
  applicationsByIdAndDateTime?:  {
    __typename: "ModelApplicationConnection",
    items:  Array< {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ApplicationsByStudentCPRAndGpaQueryVariables = {
  studentCPR: string,
  gpa?: ModelFloatKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelApplicationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ApplicationsByStudentCPRAndGpaQuery = {
  applicationsByStudentCPRAndGpa?:  {
    __typename: "ModelApplicationConnection",
    items:  Array< {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ApplicationsByBatchAndStatusQueryVariables = {
  batch: number,
  status?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelApplicationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ApplicationsByBatchAndStatusQuery = {
  applicationsByBatchAndStatus?:  {
    __typename: "ModelApplicationConnection",
    items:  Array< {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateAttachmentSubscriptionVariables = {
  filter?: ModelSubscriptionAttachmentFilterInput | null,
};

export type OnCreateAttachmentSubscription = {
  onCreateAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateAttachmentSubscriptionVariables = {
  filter?: ModelSubscriptionAttachmentFilterInput | null,
};

export type OnUpdateAttachmentSubscription = {
  onUpdateAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteAttachmentSubscriptionVariables = {
  filter?: ModelSubscriptionAttachmentFilterInput | null,
};

export type OnDeleteAttachmentSubscription = {
  onDeleteAttachment?:  {
    __typename: "Attachment",
    id: string,
    cprDoc?: string | null,
    signedContractDoc?: string | null,
    transcriptDoc?: string | null,
    schoolCertificate?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateApplicationSubscriptionVariables = {
  filter?: ModelSubscriptionApplicationFilterInput | null,
};

export type OnCreateApplicationSubscription = {
  onCreateApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type OnUpdateApplicationSubscriptionVariables = {
  filter?: ModelSubscriptionApplicationFilterInput | null,
};

export type OnUpdateApplicationSubscription = {
  onUpdateApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type OnDeleteApplicationSubscriptionVariables = {
  filter?: ModelSubscriptionApplicationFilterInput | null,
};

export type OnDeleteApplicationSubscription = {
  onDeleteApplication?:  {
    __typename: "Application",
    id: string,
    gpa?: number | null,
    status?: Status | null,
    attachmentID?: string | null,
    studentCPR: string,
    adminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    studentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    attachment?:  {
      __typename: "Attachment",
      id: string,
      cprDoc?: string | null,
      signedContractDoc?: string | null,
      transcriptDoc?: string | null,
      schoolCertificate?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    programs?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    dateTime: string,
    isEmailSent?: boolean | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    batch?: number | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAttachmentId?: string | null,
  } | null,
};

export type OnCreateProgramChoiceSubscriptionVariables = {
  filter?: ModelSubscriptionProgramChoiceFilterInput | null,
};

export type OnCreateProgramChoiceSubscription = {
  onCreateProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type OnUpdateProgramChoiceSubscriptionVariables = {
  filter?: ModelSubscriptionProgramChoiceFilterInput | null,
};

export type OnUpdateProgramChoiceSubscription = {
  onUpdateProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type OnDeleteProgramChoiceSubscriptionVariables = {
  filter?: ModelSubscriptionProgramChoiceFilterInput | null,
};

export type OnDeleteProgramChoiceSubscription = {
  onDeleteProgramChoice?:  {
    __typename: "ProgramChoice",
    id: string,
    programID: string,
    applicationID: string,
    program?:  {
      __typename: "Program",
      id: string,
      name?: string | null,
      requirements?: string | null,
      nameAr?: string | null,
      requirementsAr?: string | null,
      availability?: number | null,
      universityID: string,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      universityProgramsId?: string | null,
    } | null,
    application?:  {
      __typename: "Application",
      id: string,
      gpa?: number | null,
      status?: Status | null,
      attachmentID?: string | null,
      studentCPR: string,
      dateTime: string,
      isEmailSent?: boolean | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      batch?: number | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      applicationAttachmentId?: string | null,
    } | null,
    choiceOrder?: number | null,
    acceptanceLetterDoc?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationProgramsId?: string | null,
    programApplicationsId?: string | null,
  } | null,
};

export type OnCreateProgramSubscriptionVariables = {
  filter?: ModelSubscriptionProgramFilterInput | null,
};

export type OnCreateProgramSubscription = {
  onCreateProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type OnUpdateProgramSubscriptionVariables = {
  filter?: ModelSubscriptionProgramFilterInput | null,
};

export type OnUpdateProgramSubscription = {
  onUpdateProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type OnDeleteProgramSubscriptionVariables = {
  filter?: ModelSubscriptionProgramFilterInput | null,
};

export type OnDeleteProgramSubscription = {
  onDeleteProgram?:  {
    __typename: "Program",
    id: string,
    name?: string | null,
    requirements?: string | null,
    nameAr?: string | null,
    requirementsAr?: string | null,
    availability?: number | null,
    universityID: string,
    university?:  {
      __typename: "University",
      id: string,
      name?: string | null,
      nameAr?: string | null,
      availability?: number | null,
      isDeactivated?: boolean | null,
      isTrashed?: boolean | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    applications?:  {
      __typename: "ModelProgramChoiceConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    universityProgramsId?: string | null,
  } | null,
};

export type OnCreateUniversitySubscriptionVariables = {
  filter?: ModelSubscriptionUniversityFilterInput | null,
};

export type OnCreateUniversitySubscription = {
  onCreateUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateUniversitySubscriptionVariables = {
  filter?: ModelSubscriptionUniversityFilterInput | null,
};

export type OnUpdateUniversitySubscription = {
  onUpdateUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteUniversitySubscriptionVariables = {
  filter?: ModelSubscriptionUniversityFilterInput | null,
};

export type OnDeleteUniversitySubscription = {
  onDeleteUniversity?:  {
    __typename: "University",
    id: string,
    name?: string | null,
    nameAr?: string | null,
    Programs?:  {
      __typename: "ModelProgramConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    availability?: number | null,
    isDeactivated?: boolean | null,
    isTrashed?: boolean | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateAdminLogSubscriptionVariables = {
  filter?: ModelSubscriptionAdminLogFilterInput | null,
};

export type OnCreateAdminLogSubscription = {
  onCreateAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type OnUpdateAdminLogSubscriptionVariables = {
  filter?: ModelSubscriptionAdminLogFilterInput | null,
};

export type OnUpdateAdminLogSubscription = {
  onUpdateAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type OnDeleteAdminLogSubscriptionVariables = {
  filter?: ModelSubscriptionAdminLogFilterInput | null,
};

export type OnDeleteAdminLogSubscription = {
  onDeleteAdminLog?:  {
    __typename: "AdminLog",
    id: string,
    applicationID: string,
    adminCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    admin?:  {
      __typename: "Admin",
      cpr: string,
      fullName?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationAdminLogsId?: string | null,
    adminAdminLogsCpr?: string | null,
  } | null,
};

export type OnCreateStudentLogSubscriptionVariables = {
  filter?: ModelSubscriptionStudentLogFilterInput | null,
};

export type OnCreateStudentLogSubscription = {
  onCreateStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type OnUpdateStudentLogSubscriptionVariables = {
  filter?: ModelSubscriptionStudentLogFilterInput | null,
};

export type OnUpdateStudentLogSubscription = {
  onUpdateStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type OnDeleteStudentLogSubscriptionVariables = {
  filter?: ModelSubscriptionStudentLogFilterInput | null,
};

export type OnDeleteStudentLogSubscription = {
  onDeleteStudentLog?:  {
    __typename: "StudentLog",
    id: string,
    applicationID: string,
    studentCPR: string,
    dateTime?: string | null,
    snapshot?: string | null,
    reason?: string | null,
    student?:  {
      __typename: "Student",
      cpr: string,
      cprDoc?: string | null,
      fullName?: string | null,
      email?: string | null,
      phone?: string | null,
      gender?: Gender | null,
      nationality?: string | null,
      schoolName?: string | null,
      schoolType?: SchoolType | null,
      specialization?: string | null,
      placeOfBirth?: string | null,
      studentOrderAmongSiblings?: number | null,
      householdIncome?: number | null,
      familyIncome?: FamilyIncome | null,
      familyIncomeProofDoc?: string | null,
      familyIncomeProofDocs?: Array< string | null > | null,
      preferredLanguage?: Language | null,
      graduationDate?: string | null,
      address?: string | null,
      parentInfoID?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    applicationStudentLogsId?: string | null,
    studentStudentLogsCpr?: string | null,
  } | null,
};

export type OnCreateAdminSubscriptionVariables = {
  filter?: ModelSubscriptionAdminFilterInput | null,
};

export type OnCreateAdminSubscription = {
  onCreateAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateAdminSubscriptionVariables = {
  filter?: ModelSubscriptionAdminFilterInput | null,
};

export type OnUpdateAdminSubscription = {
  onUpdateAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteAdminSubscriptionVariables = {
  filter?: ModelSubscriptionAdminFilterInput | null,
};

export type OnDeleteAdminSubscription = {
  onDeleteAdmin?:  {
    __typename: "Admin",
    cpr: string,
    fullName?: string | null,
    email?: string | null,
    AdminLogs?:  {
      __typename: "ModelAdminLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateParentInfoSubscriptionVariables = {
  filter?: ModelSubscriptionParentInfoFilterInput | null,
};

export type OnCreateParentInfoSubscription = {
  onCreateParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateParentInfoSubscriptionVariables = {
  filter?: ModelSubscriptionParentInfoFilterInput | null,
};

export type OnUpdateParentInfoSubscription = {
  onUpdateParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteParentInfoSubscriptionVariables = {
  filter?: ModelSubscriptionParentInfoFilterInput | null,
};

export type OnDeleteParentInfoSubscription = {
  onDeleteParentInfo?:  {
    __typename: "ParentInfo",
    id: string,
    guardianFullName?: string | null,
    relation?: string | null,
    guardianCPR?: string | null,
    primaryMobile?: string | null,
    secondaryMobile?: string | null,
    fatherFullName?: string | null,
    fatherCPR?: string | null,
    motherFullName?: string | null,
    motherCPR?: string | null,
    numberOfFamilyMembers?: number | null,
    address?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnCreateStudentSubscription = {
  onCreateStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnUpdateStudentSubscription = {
  onUpdateStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnDeleteStudentSubscription = {
  onDeleteStudent?:  {
    __typename: "Student",
    cpr: string,
    cprDoc?: string | null,
    fullName?: string | null,
    email?: string | null,
    phone?: string | null,
    gender?: Gender | null,
    nationality?: string | null,
    schoolName?: string | null,
    schoolType?: SchoolType | null,
    specialization?: string | null,
    placeOfBirth?: string | null,
    studentOrderAmongSiblings?: number | null,
    householdIncome?: number | null,
    familyIncome?: FamilyIncome | null,
    familyIncomeProofDoc?: string | null,
    familyIncomeProofDocs?: Array< string | null > | null,
    preferredLanguage?: Language | null,
    graduationDate?: string | null,
    address?: string | null,
    applications?:  {
      __typename: "ModelApplicationConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    ParentInfo?:  {
      __typename: "ParentInfo",
      id: string,
      guardianFullName?: string | null,
      relation?: string | null,
      guardianCPR?: string | null,
      primaryMobile?: string | null,
      secondaryMobile?: string | null,
      fatherFullName?: string | null,
      fatherCPR?: string | null,
      motherFullName?: string | null,
      motherCPR?: string | null,
      numberOfFamilyMembers?: number | null,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    parentInfoID?: string | null,
    StudentLogs?:  {
      __typename: "ModelStudentLogConnection",
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
