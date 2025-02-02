import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  Admin,
  AdminLog,
  Application,
  BahrainUniversities,
  CreateAdminLogMutation,
  CreateAdminLogMutationVariables,
  CreateAdminMutation,
  CreateAdminMutationVariables,
  CreateApplicationMutation,
  CreateApplicationMutationVariables,
  CreateAttachmentMutation,
  CreateAttachmentMutationVariables,
  CreateBahrainUniversitiesMutation,
  CreateBahrainUniversitiesMutationVariables,
  CreateBatchMutation,
  CreateBatchMutationVariables,
  CreateMasterBatchMutation,
  CreateMasterBatchMutationVariables,
  CreateMasterAppliedUniversitiesMutation,
  CreateMasterAppliedUniversitiesMutationVariables,
  CreateProgramChoiceMutation,
  CreateProgramChoiceMutationVariables,
  CreateScholarshipMutation,
  CreateScholarshipMutationVariables,
  CreateStudentLogMutation,
  CreateStudentLogMutationVariables,
  GetBatchQuery,
  GetBatchQueryVariables,
  GetMasterBatchQuery,
  GetMasterBatchQueryVariables,
  GetScholarshipQuery,
  GetScholarshipQueryVariables,
  ListBatchesQuery,
  ListBatchesQueryVariables,
  ListMasterBatchesQuery,
  ListMasterBatchesQueryVariables,
  MasterApplication,
  MasterAppliedUniversities,
  Program,
  Scholarship,
  StudentLog,
  University,
  UpdateAdminMutation,
  UpdateAdminMutationVariables,
  UpdateApplicationMutation,
  UpdateApplicationMutationVariables,
  UpdateAttachmentMutation,
  UpdateAttachmentMutationVariables,
  UpdateBahrainUniversitiesMutation,
  UpdateBahrainUniversitiesMutationVariables,
  UpdateBatchMutation,
  UpdateBatchMutationVariables,
  UpdateMasterAttachmentMutation,
  UpdateMasterAttachmentMutationVariables,
  UpdateMasterBatchMutation,
  UpdateMasterBatchMutationVariables,
  UpdateMasterAppliedUniversitiesMutation,
  UpdateMasterAppliedUniversitiesMutationVariables,
  UpdateParentInfoMutation,
  UpdateParentInfoMutationVariables,
  UpdateProgramChoiceMutation,
  UpdateProgramChoiceMutationVariables,
  UpdateProgramMutation,
  UpdateProgramMutationVariables,
  UpdateScholarshipMutation,
  UpdateScholarshipMutationVariables,
  UpdateStudentMutation,
  UpdateStudentMutationVariables,
  UpdateUniversityMutation,
  UpdateUniversityMutationVariables,
  MasterLog,
} from "./API";
import {
  createAttachment,
  updateAttachment,
  createApplication,
  updateApplication,
  createProgramChoice,
  updateProgramChoice,
  createStudentLog,
  createAdminLog,
  updateProgram,
  updateUniversity,
  updateAdmin,
  createAdmin,
  updateBatch,
  createBatch,
  updateParentInfo,
  updateStudent,
  updateMasterBatch,
  createMasterBatch,
  updateScholarship,
  createScholarship,
  updateMasterAppliedUniversities,
  updateBahrainUniversities,
  createMasterAppliedUniversities,
  createBahrainUniversities,
  updateMasterAttachment,
} from "./graphql/mutations";
import {
  getBatch,
  listBatches,
  getMasterBatch,
  listMasterBatches,
  getScholarship,
} from "./graphql/queries";

import { TStatistics } from "./custom-types";

/* -------------------------------------------------------------------------- */
/*                                 INTERFACES                                 */
/* -------------------------------------------------------------------------- */
interface IlistAllAdminsLogs {
  nextPageToken: string | null;
  limit?: number;
}
export interface IlistAllAdminsLogsOutput {
  adminsLogs: AdminLog[];
  nextToken: string | null;
}

export interface DownloadLinks {
  schoolCertificate?: string | null;
  transcriptDoc?: string | null;
  signedContractDoc?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                                    ENUMS                                   */
/* -------------------------------------------------------------------------- */
export enum DocType {
  CPR,
  ACCEPTANCE,
  TRANSCRIPT,
  SIGNED_CONTRACT,
  UNSIGNED_CONTRACT,
  SCHOOL_CERTIFICATE,
  FAMILY_INCOME_PROOF,
  PRIMARY_PROGRAM_ACCEPTANCE,
  SECONDARY_PROGRAM_ACCEPTANCE,
  BANK_LETTER,
  // Masters
  INCOME,
  GUARDIAN,
  UNIVERSITY_CERTIFICATE,
  TOEFL_IELTS,
}

/* -------------------------------------------------------------------------- */
/*                             CUSTOM API QUERIES                             */
/* -------------------------------------------------------------------------- */

/**
 * It takes an application ID as a parameter and returns the application data as a promise
 * @param {string} id - string
 * @returns A promise of an application
 */
export async function getApplicationData(
  id: string
): Promise<Application | undefined> {
  let q = `query MyQuery {
        getApplication(id: "${id}") {
                id
                _version
                _deleted
                gpa
                createdAt
                attachmentID
                applicationAttachmentId
                _lastChangedAt
                studentCPR
                status
                updatedAt
                attachment {
                  id
                  transcriptDoc
                  signedContractDoc
                  cprDoc
                  schoolCertificate
                  _version
                  _deleted
                  _lastChangedAt
                  createdAt
                  updatedAt
                }
                programs {
                  items {
                    id
                    choiceOrder
                    acceptanceLetterDoc
                    applicationID
                    applicationProgramsId
                    programApplicationsId
                    programID
                    program {
                      id
                      name
                      minimumGPA
                      requirements
                      requirementsAr
                      availability
                      university {
                        id
                        name
                      }
                      _version
                      _deleted
                    }
                    _version
                    _deleted
                  }
                }
                studentLogs {
                  items {
                    id
                    dateTime
                    studentCPR
                    snapshot
                    reason
                    applicationStudentLogsId
                    applicationID
                    _version
                  }
                }
                adminLogs {
                  items {
                    adminCPR
                    adminAdminLogsCpr
                    applicationAdminLogsId
                    _deleted
                    _lastChangedAt
                    _version
                    applicationID
                    createdAt
                    dateTime
                    id
                    reason
                    snapshot
                    updatedAt
                    admin {
                      fullName
                    }
                  }
                }
              }
      }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let application = res.data?.getApplication as Application;

  return application;
}

/**
 * It queries the GraphQL API for all the programs in the database, and returns them as an array of
 * Program objects
 * @returns A list of all programs
 */
export async function listAllPrograms() {
  let q = `
  query ListAllPrograms {
    listPrograms(limit: 9999999) {
      items {
        id
        name
        nameAr
        requirements
        requirementsAr
        minimumGPA
        universityID
        universityProgramsId
        updatedAt
        createdAt
        availability
        _version
        _lastChangedAt
        _deleted
        university {
          id
          _deleted
          _version
          name
          nameAr
          availability
        }
      }
    }
  }
    `;

  let res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>; // your fetch function here
  let programs = res.data?.listPrograms.items as Program[];
  return programs;
}

/**
 * It takes in a mutation variable object, and returns a promise that resolves to a GraphQL result
 * object
 * @param {CreateAttachmentMutationVariables} mutationVars - CreateAttachmentMutationVariables
 * @returns The data from the mutation.
 */
export async function createAttachmentInDB(
  mutationVars: CreateAttachmentMutationVariables
): Promise<CreateAttachmentMutation | undefined> {
  let res = (await API.graphql({
    query: createAttachment,
    variables: mutationVars,
  })) as GraphQLResult<CreateAttachmentMutation>;

  return res.data;
}

/**
 * This function creates an admin in a database using GraphQL and returns the result.
 * @param {CreateAdminMutationVariables} mutationVars - CreateAdminMutationVariables is a type of
 * variable that contains the input values required for the createAdmin mutation. It includes fields
 * such as name, email, and password. The createAdminInDB function takes in these variables as a
 * parameter to create a new admin in the database using the createAdmin mutation.
 * @returns a Promise that resolves to a CreateAdminMutation object or undefined.
 */
export async function createAdminInDB(
  mutationVars: CreateAdminMutationVariables
): Promise<CreateAdminMutation | undefined> {
  let res = (await API.graphql({
    query: createAdmin,
    variables: mutationVars,
  })) as GraphQLResult<CreateAdminMutation>;

  return res.data;
}

/**
 * It takes in a mutation variable object, and returns a promise that resolves to the mutation result
 * @param {UpdateAttachmentMutationVariables} mutationVars - UpdateAttachmentMutationVariables
 * @returns The return type is a promise that resolves to an object of type UpdateAttachmentMutation.
 */
export async function updateAttachmentInDB(
  mutationVars: UpdateAttachmentMutationVariables
): Promise<UpdateAttachmentMutation | undefined> {
  let res = (await API.graphql({
    query: updateAttachment,
    variables: mutationVars,
  })) as GraphQLResult<UpdateAttachmentMutation>;

  return res.data;
}

//TODO comment && test
export async function updateMasterAttachmentInDB(
  mutationVars: UpdateMasterAttachmentMutationVariables
): Promise<UpdateMasterAttachmentMutation | undefined> {
  let res = (await API.graphql({
    query: updateMasterAttachment,
    variables: mutationVars,
  })) as GraphQLResult<UpdateMasterAttachmentMutation>;

  return res.data;
}

/**
 * It takes in a mutation variable object, and returns a promise that resolves to a mutation object
 * @param {CreateApplicationMutationVariables} mutationVars - CreateApplicationMutationVariables
 * @returns The data from the mutation.
 */
export async function createApplicationInDB(
  mutationVars: CreateApplicationMutationVariables
): Promise<CreateApplicationMutation | undefined> {
  let res = (await API.graphql({
    query: createApplication,
    variables: mutationVars,
  })) as GraphQLResult<CreateApplicationMutation>;

  return res.data;
}

/**
 * It takes in a set of variables, and returns the result of the mutation
 * @param {UpdateApplicationMutationVariables} mutationVars - UpdateApplicationMutationVariables
 * @returns The data from the mutation.
 */
export async function updateApplicationInDB(
  mutationVars: UpdateApplicationMutationVariables
): Promise<UpdateApplicationMutation | undefined> {
  let res = (await API.graphql({
    query: updateApplication,
    variables: mutationVars,
  })) as GraphQLResult<UpdateApplicationMutation>;

  return res.data;
}

/**
 * This function updates an admin in a database using GraphQL.
 * @param {UpdateAdminMutationVariables} mutationVars - mutationVars is a variable of type
 * UpdateAdminMutationVariables that contains the input values required for the updateAdmin mutation.
 * These input values include the ID of the admin to be updated and any fields that need to be updated.
 * The mutationVars variable is passed as an argument to the updateAdminInDB function
 * @returns a Promise that resolves to an object of type `UpdateAdminMutation` or `undefined`.
 */
export async function updateAdminInDB(
  mutationVars: UpdateAdminMutationVariables
): Promise<UpdateAdminMutation | undefined> {
  let res = (await API.graphql({
    query: updateAdmin,
    variables: mutationVars,
  })) as GraphQLResult<UpdateAdminMutation>;

  return res.data;
}

/**
 * It takes in a variable of type CreateProgramChoiceMutationVariables and returns a promise of type
 * CreateProgramChoiceMutation or undefined
 * @param {CreateProgramChoiceMutationVariables} mutationVars - CreateProgramChoiceMutationVariables
 * @returns The data from the mutation.
 */
export async function createProgramChoiceInDB(
  mutationVars: CreateProgramChoiceMutationVariables
): Promise<CreateProgramChoiceMutation | undefined> {
  let res = (await API.graphql({
    query: createProgramChoice,
    variables: mutationVars,
  })) as GraphQLResult<CreateProgramChoiceMutation>;

  return res.data;
}

/**
 * It takes in a `mutationVars` object, and returns a promise that resolves to the
 * `UpdateProgramChoiceMutation` object
 * @param {UpdateProgramChoiceMutationVariables} mutationVars - UpdateProgramChoiceMutationVariables
 * @returns The data from the mutation
 */
export async function updateProgramChoiceInDB(
  mutationVars: UpdateProgramChoiceMutationVariables
): Promise<UpdateProgramChoiceMutation | undefined> {
  let res = (await API.graphql({
    query: updateProgramChoice,
    variables: mutationVars,
  })) as GraphQLResult<UpdateProgramChoiceMutation>;

  return res.data;
}

/**
 * It takes in a mutation variable object, and returns a promise that resolves to the mutation result
 * @param {CreateStudentLogMutationVariables} mutationVars - CreateStudentLogMutationVariables
 * @returns The data from the mutation
 */
export async function createStudentLogInDB(
  mutationVars: CreateStudentLogMutationVariables
): Promise<CreateStudentLogMutation | undefined> {
  let res = (await API.graphql({
    query: createStudentLog,
    variables: mutationVars,
  })) as GraphQLResult<CreateStudentLogMutation>;

  return res.data;
}

/**
 * It takes a file and a document type, and uploads the file to the AWS S3 bucket, and returns the
 * key of the file
 * @param {File} file - File - The file to be uploaded
 * @param {DocType} type - DocType - this is an enum that I have defined in my code.
 * @returns The key of the file uploaded to the storage bucket.
 */
export async function uploadFile(
  file: File,
  type: DocType,
  cpr: string,
  index?: number
) {
  try {
    let res = await Storage.put(
      `Student${cpr}/${cpr}#${DocType[type]}${
        index ? `-${index}` : ""
      }#${new Date().getTime()}`,
      file,
      {
        contentType: file.type,
      }
    );
    return res.key;
  } catch (error) {
    console.log("Error uploading file: ", error);
    return null;
  }
}

/**
 * It creates a new admin log in the database
 * @param {CreateAdminLogMutationVariables} mutationVars - CreateAdminLogMutationVariables
 * @returns The data from the mutation.
 */
export async function createAdminLogInDB(
  mutationVars: CreateAdminLogMutationVariables
): Promise<CreateAdminLogMutation | undefined> {
  let res = (await API.graphql({
    query: createAdminLog,
    variables: mutationVars,
  })) as GraphQLResult<CreateAdminLogMutation>;

  return res.data;
}

/**
 * It returns a list of admin logs for a given application
 * @param {string} id - string - The id of the application you want to get the admin logs for.
 * @returns An array of AdminLogs
 */
export async function getApplicationLogHistory(
  id: string
): Promise<AdminLog[]> {
  let q = `
  query GetApplicationLogHistory {
    getApplication(id: "${id}") {
      adminLogs {
        items {
          adminCPR
          adminAdminLogsCpr
          applicationAdminLogsId
          _deleted
          _lastChangedAt
          _version
          applicationID
          createdAt
          dateTime
          id
          reason
          snapshot
          updatedAt
          admin {
            fullName
          }
        }
      }
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return [];
  }

  let adminLogs = res.data.getApplication.adminLogs.items as AdminLog[];

  return adminLogs;
}

/**
 * It takes a CPR number as input and returns an Admin object
 * @param {string} id - The id of the admin you want to get.
 * @returns A promise of an Admin or undefined
 */
export async function getAdminByCPR(id: string): Promise<Admin | undefined> {
  let q = `
  query GetAdminByCPR {
    getAdmin(cpr: "${id}") {
      cpr
      _version
      email
      role
      fullName
      isDeactivated
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let admin = res.data.getAdmin as Admin;

  return admin;
}

/**
 * It returns all student logs of a given application
 * @param {string} applicationID - The ID of the application you want to get the student logs for.
 * @returns An array of StudentLogs
 */
export async function listAllStudentLogsOfApplication(applicationID: string) {
  let q = `
  query GetAllApplicationStudentLogs {
    getApplication(id: "${applicationID}") {
      studentLogs {
        items {
          id
          _version
          _lastChangedAt
          _deleted
          applicationID
          applicationStudentLogsId
          createdAt
          dateTime
          reason
          snapshot
          studentCPR
          studentStudentLogsCpr
          updatedAt
        }
      }
    }
  } 
    `;

  let res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>; // your fetch function here
  let studentLogs = res.data
    ? (res.data?.getApplication?.studentLogs?.items as StudentLog[])
    : [];
  return studentLogs;
}

export async function listAllMasterStudentLogsOfApplication(
  applicationID: string
) {
  let q = `
  query GetAllMasterApplicationStudentLogs {
  getMasterApplication(id: "${applicationID}") {
    id
    masterLogs {
      items {
        id
        _version
        _lastChangedAt
        _deleted
        applicationID
        createdAt
        dateTime
        reason
        snapshot
        studentCPR
        updatedAt
        masterApplicationMasterLogsId
        studentM_MasterLogsCpr
      }
    }
  }
}
    `;

  let res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>; // your fetch function here
  let studentLogs = res.data
    ? (res.data?.getMasterApplication?.masterLogs?.items as MasterLog[])
    : [];
  return studentLogs;
}

/**
 * It returns a list of all the admin logs in the database
 * @param {IlistAllAdminsLogs} input - IlistAllAdminsLogs
 * @returns IlistAllAdminsLogsOutput
 */
export async function listAllAdminsLogs(input: IlistAllAdminsLogs) {
  let q = `
  query ListAllAdminsLogs {
  listAdminLogs(limit: ${input.limit ?? 5}, nextToken: ${
    input.nextPageToken ? `"${input.nextPageToken}"` : null
  }) {
    items {
      _deleted
      _lastChangedAt
      _version
      admin {
        cpr
        email
        fullName
      }
      adminAdminLogsCpr
      adminCPR
      applicationAdminLogsId
      applicationID
      createdAt
      dateTime
      id
      reason
      snapshot
      updatedAt
    }
    nextToken
  }
}
    `;

  let res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>; // your fetch function here
  let adminsLogs = res.data ? (res.data.listAdminLogs.items as AdminLog[]) : [];
  const output: IlistAllAdminsLogsOutput = {
    adminsLogs: adminsLogs,
    nextToken: res.data.listAdminLogs.nextToken,
  };
  return output;
}

/**
 * It gets a student log by its ID
 * @param {string} id - string
 * @returns StudentLog
 */
export async function getStudentLogsByLogID(
  id: string
): Promise<StudentLog | undefined> {
  let q = `
  query StudentLogHistoryInfo {
    getStudentLog(id: "${id}") {
      id
      _version
      _lastChangedAt
      _deleted
      applicationID
      applicationStudentLogsId
      createdAt
      dateTime
      studentCPR
      studentStudentLogsCpr
      updatedAt
      reason
      snapshot
      student {
        fullName
        email
        phone
        cpr
      }
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let studentLog = res.data.getStudentLog as StudentLog;

  return studentLog;
}

export async function getMasterStudentLogsByLogID(
  id: string
): Promise<MasterLog | undefined> {
  let q = `
  query MasterStudentLogHistoryInfo {
      getMasterLog(id: "${id}") {
      id
      _version
      _lastChangedAt
      _deleted
      applicationID
      applicationStudentLogsId
      createdAt
      dateTime
      studentCPR
      studentStudentLogsCpr
      updatedAt
      reason
      snapshot
      student {
        fullName
        email
        phone
        cpr
      }
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let studentLog = res.data.getMasterLog as MasterLog;

  return studentLog;
}

/**
 * It gets an admin log by its ID
 * @param {string} id - string
 * @returns AdminLog
 */
export async function getAdminLogsByLogID(
  id: string
): Promise<AdminLog | undefined> {
  let q = `
  query GetAdminLogById {
    getAdminLog(id: "${id}") {
      _deleted
      _lastChangedAt
      _version
      admin {
        cpr
        email
        fullName
        _deleted
      }
      adminAdminLogsCpr
      adminCPR
      applicationAdminLogsId
      applicationID
      dateTime
      id
      reason
      snapshot
      updatedAt
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let adminLog = res.data.getAdminLog as AdminLog;

  return adminLog;
}

/**
 * It takes in a program ID and returns a program object
 * @param {string} id - The id of the program you want to get
 * @returns A program object
 */
export async function getProgramById(id: string): Promise<Program | undefined> {
  let q = `
  query GetProgramLogById {
    getProgram(id: "${id}") {
      _deleted
      _lastChangedAt
      _version
      availability
      createdAt
      id
      isDeactivated
      name
      nameAr
      requirements
      minimumGPA
      requirementsAr
      university {
        name
        nameAr
        availability
        isDeactivated
        id
      }
      universityID
      universityProgramsId
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let program = res.data.getProgram as Program;

  return program;
}

/**
 * It takes in a `mutationVars` object, and returns a promise that resolves to the
 * `UpdateProgramMutation` object
 * @param {UpdateProgramMutationVariables} mutationVars - UpdateProgramMutationVariables
 * @returns The data from the mutation
 */
export async function updateProgramById(
  mutationVars: UpdateProgramMutationVariables
): Promise<UpdateProgramMutation | undefined> {
  let res = (await API.graphql({
    query: updateProgram,
    variables: mutationVars,
  })) as GraphQLResult<UpdateProgramMutation>;

  return res.data;
}

/**
 * This function takes in a university ID and returns all programs related to the University
 * @param {string} [id] - The ID of the university you want to get.
 * @returns A list of programs
 */
export async function getUniversityByID(
  id?: string
): Promise<University | undefined> {
  let query = `
  query GetUniInfo {
    getUniversity(id: "${id}") {
      id
      _version
      _lastChangedAt
      _deleted
      name
      nameAr
      updatedAt
      createdAt
      availability
      isDeactivated
      isException
      isExtended
      extensionDuration
      isTrashed
      Programs {
        items {
          isDeactivated
          name
          nameAr
          requirements
          requirementsAr
          universityID
          universityProgramsId
          updatedAt
          createdAt
          minimumGPA
          availability
          id
          _version
          _lastChangedAt
          _deleted
        }
      }
    }
  }
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  let tempProgramList = res.data.getUniversity as University;

  return tempProgramList;
}

export async function getMasterUniversityByID(
  id?: string
): Promise<MasterAppliedUniversities | undefined> {
  let query = `
  query GetMasterAppliedUniversities {
    getMasterAppliedUniversities(id:  "${id}") {
      id
      universityName
      universityNameAr
      availability
      _deleted
      _lastChangedAt
      _version
      isDeactivated
      updatedAt
      createdAt
    }
  }
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  let tempProgramList = res.data
    .getMasterAppliedUniversities as MasterAppliedUniversities;

  return tempProgramList;
}

export async function createMasterUniversityInDb(
  mutationVars: CreateMasterAppliedUniversitiesMutationVariables
): Promise<CreateMasterAppliedUniversitiesMutation | undefined> {
  let res = (await API.graphql({
    query: createMasterAppliedUniversities,
    variables: mutationVars,
  })) as GraphQLResult<CreateMasterAppliedUniversitiesMutation>;

  return res.data;
}

export async function getBahrainiUniversityById(
  id?: string
): Promise<BahrainUniversities | undefined> {
  let query = `
  query GetBahrainiUniversities {
    getBahrainUniversities(id: "${id}"){
      id
      universityName
      universityNameAr
      availability
      _deleted
      _lastChangedAt
      _version
      isDeactivated
      updatedAt
      createdAt
    }
  }
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  let tempProgramList = res.data.getBahrainUniversities as BahrainUniversities;

  return tempProgramList;
}

export async function createBahrainiUniversityInDb(
  mutationVars: CreateBahrainUniversitiesMutationVariables
): Promise<CreateBahrainUniversitiesMutation | undefined> {
  let res = (await API.graphql({
    query: createBahrainUniversities,
    variables: mutationVars,
  })) as GraphQLResult<CreateBahrainUniversitiesMutation>;

  return res.data;
}

interface IUpdateEmailSentToApplication {
  applicationId: string;
  version: number;
  isEmailSent: boolean;
}

export async function updateEmailSentToApplication(
  input: IUpdateEmailSentToApplication
): Promise<boolean> {
  let query = `
  mutation UpdateEmailSentToApplication {
    updateApplication(input: {id: "${input.applicationId}", _version: ${input.version}, isEmailSent: ${input.isEmailSent}}) {
      id
      _version
      isEmailSent
    }
  }
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  let tempApplication = res.data.updateApplication as Application;

  return tempApplication.isEmailSent ?? false;
}

/**
 * It takes in a mutation variable object, and returns a promise that resolves to the mutation result
 * @param {UpdateUniversityMutationVariables} mutationVars - UpdateUniversityMutationVariables
 * @returns The mutation result.
 */
export async function updateUniversityById(
  mutationVars: UpdateUniversityMutationVariables
): Promise<UpdateUniversityMutation | undefined> {
  let res = (await API.graphql({
    query: updateUniversity,
    variables: mutationVars,
  })) as GraphQLResult<UpdateUniversityMutation>;

  return res.data;
}

//TODO comment
export async function updateMasterUniversityById(
  mutationVars: UpdateMasterAppliedUniversitiesMutationVariables
): Promise<UpdateMasterAppliedUniversitiesMutation | undefined> {
  let res = (await API.graphql({
    query: updateMasterAppliedUniversities,
    variables: mutationVars,
  })) as GraphQLResult<UpdateMasterAppliedUniversitiesMutation>;

  return res.data;
}

//TODO comment
export async function updateBahrainUniversityById(
  mutationVars: UpdateBahrainUniversitiesMutationVariables
): Promise<UpdateBahrainUniversitiesMutation | undefined> {
  let res = (await API.graphql({
    query: updateBahrainUniversities,
    variables: mutationVars,
  })) as GraphQLResult<UpdateBahrainUniversitiesMutation>;

  return res.data;
}

/**
 * This is a TypeScript function that retrieves all applications from a GraphQL API based on a
 * specified batch number.
 * @param {number} batch - The batch parameter is a number that is used to filter the applications
 * returned by the API call. It specifies the batch number of the applications to retrieve.
 * @returns a Promise that resolves to an array of Application objects or undefined.
 */
export async function getAllApplicationsAPI(
  batch: number
): Promise<Application[] | undefined> {
  let query = `
  query ListAllApplications {
    applicationsByBatchAndStatus(batch: ${batch}, limit: 999999999) {
      items {
        _version
        _deleted
        schoolType
        batch
        dateTime
        applicationAttachmentId
        attachmentID
        gpa
        id
        isEmailSent
        status
        studentCPR
        programs {
          items {
            _deleted
            id
            programID
            program {
              id
              name
              nameAr
              minimumGPA
              university {
                name
                nameAr
                id
              }
            }
          }
        }
        createdAt
        updatedAt
        student {
          fullName
        }
      }
    }
  }
  
`;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all applications");
  }

  let tempApplicationList = res.data;
  let temp: Application[] = (tempApplicationList?.applicationsByBatchAndStatus
    ?.items ?? []) as Application[];

  return temp;
}

export async function getAllApplicationsForCorrections(batch: number) {
  var nextToken: string | null = null;
  const applicationList: Application[] = [];

  do {
    const result: IApplicationsWithNextToken =
      await getAllApplicationsForCorrectionWithPaginationAPI(batch, nextToken);
    applicationList.push(...result.applications);
    nextToken = result.nextToken;
  } while (nextToken);
  return applicationList;
}
async function getAllApplications(batch: number) {
  var nextToken: string | null = null;
  const applicationList: Application[] = [];

  do {
    const result: IApplicationsWithNextToken =
      await getAllApplicationsWithPaginationAPI(batch, nextToken);
    applicationList.push(...result.applications);
    nextToken = result.nextToken;
  } while (nextToken);
  return applicationList;
}

async function getAllMasterApplications(batch: number) {
  var nextToken: string | null = null;
  const masterApplicationList: MasterApplication[] = [];

  do {
    const result: IMasterApplicationsWithNextToken =
      await getAllMasterApplicationsWithPaginationAPI(batch, nextToken);
    masterApplicationList.push(...result.masterApplications);
    nextToken = result.nextToken;
  } while (nextToken);
  return masterApplicationList;
}

export async function getAllApplicationsLambda(
  batch: number
): Promise<Application[]> {
  try {
    const _applications: Application[] = await getAllApplications(batch);

    return _applications;
  } catch (error) {
    console.log("error retrieving all applications", error);
    return [];
  }
}

export async function getAllMasterApplicationsLambda(
  batch: number
): Promise<MasterApplication[]> {
  try {
    const _applications: MasterApplication[] = await getAllMasterApplications(
      batch
    );

    return _applications;
  } catch (error) {
    console.log("error retrieving all applications", error);
    return [];
  }
}

export interface IApplicationsWithNextToken {
  applications: Application[];
  nextToken: string | null;
}
export interface IMasterApplicationsWithNextToken {
  masterApplications: MasterApplication[];
  nextToken: string | null;
}

export async function getAllApplicationsForCorrectionWithPaginationAPI(
  batch: number,
  nextToken?: string | null
): Promise<IApplicationsWithNextToken> {
  let query = `
  query ListAllApplications {
    applicationsByBatchAndStatus(batch: ${batch}, limit: 1000, nextToken: ${
    nextToken ? `"${nextToken}"` : null
  }) {
      items {
        _version
        gpa
        id
        studentCPR
      }
        nextToken
    }
  }  
`;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all applications");
  }

  let tempApplicationList = res.data;
  let temp: Application[] = (tempApplicationList?.applicationsByBatchAndStatus
    ?.items ?? []) as Application[];

  const functionResult: IApplicationsWithNextToken = {
    applications: temp,
    nextToken: tempApplicationList?.applicationsByBatchAndStatus.nextToken,
  };

  return functionResult;
}
export async function getAllApplicationsWithPaginationAPI(
  batch: number,
  nextToken?: string | null
): Promise<IApplicationsWithNextToken> {
  let query = `
  query ListAllApplications {
    applicationsByBatchAndStatus(batch: ${batch}, limit: 1000, nextToken: ${
    nextToken ? `"${nextToken}"` : null
  }) {
    items {
      _version
      _deleted
      schoolType
      batch
      dateTime
      applicationAttachmentId
      attachmentID
      gpa
      id
      isEmailSent
      status
      studentCPR
      programs {
        items {
          _deleted
          id
          programID
          choiceOrder
          program {
            id
            name
            nameAr
            minimumGPA
            university {
              name
              nameAr
              id
            }
          }
        }
      }
      createdAt
      updatedAt
      student {
        fullName
        email
        phone
        familyIncome
        gender
        nationality
        graduationDate 
        ParentInfo {
          numberOfFamilyMembers
        }
      }
    }
        nextToken
    }
  }  
`;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all applications");
  }

  let tempApplicationList = res.data;
  let temp: Application[] = (tempApplicationList?.applicationsByBatchAndStatus
    ?.items ?? []) as Application[];

  const functionResult: IApplicationsWithNextToken = {
    applications: temp,
    nextToken: tempApplicationList?.applicationsByBatchAndStatus.nextToken,
  };

  return functionResult;
}

export async function getAllMasterApplicationsWithPaginationAPI(
  batch: number,
  nextToken?: string | null
): Promise<IMasterApplicationsWithNextToken> {
  let query = `
  query ListAllApplications {
    applicationsByBatchAndStatus(batch: ${batch}, limit: 1000, nextToken: ${
    nextToken ? `"${nextToken}"` : null
  }) {
    items {
      _version
      _deleted
      schoolType
      batch
      dateTime
      applicationAttachmentId
      attachmentID
      gpa
      id
      isEmailSent
      status
      studentCPR
      programs {
        items {
          _deleted
          id
          programID
          choiceOrder
          program {
            id
            name
            nameAr
            minimumGPA
            university {
              name
              nameAr
              id
            }
          }
        }
      }
      createdAt
      updatedAt
      student {
        fullName
        email
        phone
        familyIncome
        gender
        nationality
        graduationDate 
        ParentInfo {
          numberOfFamilyMembers
        }
      }
    }
        nextToken
    }
  }  
`;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all applications");
  }

  let tempMasterApplicationList = res.data;
  let temp: MasterApplication[] = (tempMasterApplicationList
    ?.masterApplicationsByBatchAndStatus?.items ?? []) as MasterApplication[];

  const functionResult: IMasterApplicationsWithNextToken = {
    masterApplications: temp,
    nextToken:
      tempMasterApplicationList?.masterApplicationsByBatchAndStatus.nextToken,
  };

  return functionResult;
}

/**
 * This function retrieves all approved applications for a given batch from a GraphQL API.
 * @param {number} batch - The batch number for which to retrieve all approved applications.
 * @returns a Promise that resolves to an array of Application objects or undefined.
 */
export async function getAllApprovedApplicationsAPI(
  batch: number
): Promise<Application[] | undefined> {
  let query = `
  query ListAllApprovedApplications {
    applicationsByBatchAndStatus(batch: ${batch}, status: {eq: "APPROVED"}, limit: 999999999) {
      items {
        _version
        _deleted
        dateTime
        applicationAttachmentId
        attachmentID
        gpa
        id
        status
        studentCPR
        batch
        programs {
          items {
            _deleted
            id
            acceptanceLetterDoc
            programID
            program {
              id
              name
              minimumGPA
              university {
                name
                id
              }
            }
          }
        }
        createdAt
        updatedAt
        student {
          fullName
        }
      }
    }
  }  
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all APPROVED applications");
  }

  let tempApplicationList = res.data;
  let temp: Application[] = (tempApplicationList?.applicationsByBatchAndStatus
    ?.items ?? []) as Application[];

  return temp;
}

/* -------------------------------------------------------------------------- */
/*                              Batches                                       */
/* -------------------------------------------------------------------------- */

export async function listAllBatches(
  variables: ListBatchesQueryVariables
): Promise<ListBatchesQuery | undefined> {
  let res = (await API.graphql({
    query: listBatches,
    variables: variables,
  })) as GraphQLResult<ListBatchesQuery>;

  return res.data;
}

export async function listAllMasterBatches(
  variables: ListMasterBatchesQueryVariables
): Promise<ListMasterBatchesQuery | undefined> {
  let res = (await API.graphql({
    query: listMasterBatches,
    variables: variables,
  })) as GraphQLResult<ListMasterBatchesQuery>;

  return res.data;
}

export async function getSingleBatch(
  variables: GetBatchQueryVariables
): Promise<GetBatchQuery | undefined> {
  let res = (await API.graphql({
    query: getBatch,
    variables: variables,
  })) as GraphQLResult<GetBatchQuery>;

  return res.data;
}

export async function getSingleMasterBatch(
  variables: GetMasterBatchQueryVariables
): Promise<GetMasterBatchQuery | undefined> {
  let res = (await API.graphql({
    query: getMasterBatch,
    variables: variables,
  })) as GraphQLResult<GetMasterBatchQuery>;

  return res.data;
}

export async function getSingleScholarship(
  variables: GetScholarshipQueryVariables
): Promise<GetScholarshipQuery | undefined> {
  let res = (await API.graphql({
    query: getScholarship,
    variables: variables,
  })) as GraphQLResult<GetScholarshipQuery>;

  return res.data;
}

export async function updateSingleScholarship(
  variables: UpdateScholarshipMutationVariables
): Promise<UpdateScholarshipMutation | undefined> {
  let res = (await API.graphql({
    query: updateScholarship,
    variables: variables,
  })) as GraphQLResult<UpdateScholarshipMutation>;

  return res.data;
}

export async function createSingleScholarship(
  variables: CreateScholarshipMutationVariables
): Promise<CreateScholarshipMutation | undefined> {
  let res = (await API.graphql({
    query: createScholarship,
    variables: variables,
  })) as GraphQLResult<CreateScholarshipMutation>;

  return res.data;
}

export async function listAllScholarshipsOfBatch({
  nextToken,
  batch,
}: {
  batch: number;
  nextToken?: string | null;
}): Promise<{ nextToken: string | null; items: Scholarship[] }> {
  let query = `query listAllScholarshipsByBatch {
    scholarshipsByBatchAndStatus(batch: ${batch}, nextToken: ${`${nextToken}`}) {
    nextToken
      items {
        id
        _version
        createdAt
        IBANLetterDoc
        signedContractDoc
        isConfirmed
        status
        studentCPR
        IBAN
        bankName
        guardianSignature
        studentSignature
        unsignedContractDoc
        application {
          studentName
        }
      }
    }
  }
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all scholarships");
  }

  let tempScholarshipList = res.data?.scholarshipsByBatchAndStatus;

  return tempScholarshipList;
}
export async function listScholarshipsOfApplicationId({
  applicationId,
}: {
  applicationId: string;
}): Promise<Scholarship[]> {
  let query = `query ListScholarshipsByApplicationID {
    scholarshipsByApplicationID(applicationID: "${applicationId}") {
      items {
        id
        signedContractDoc
        IBANLetterDoc
        isConfirmed
      }
    }
  }  
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error("Failed to get all scholarships");
  }

  let tempScholarshipList = res.data?.scholarshipsByApplicationID?.items;

  return tempScholarshipList ?? [];
}

export async function getScholarshipsWithId({
  id,
}: {
  id: string;
}): Promise<Scholarship | null> {
  let query = `query GetSingleScholarship {
    getScholarship(id: "${id}") {
      id
      _version
      batch
      IBAN
      IBANLetterDoc
      bankName
      guardianSignature
      isConfirmed
      signedContractDoc
      status
      studentCPR
      studentSignature
      unsignedContractDoc
      applicationID
      application {
        id
        _version
        adminPoints
        batch
        createdAt
        dateTime
        familyIncome
        gpa
        isEmailSent
        isFamilyIncomeVerified
        nationalityCategory
        processed
        programApplicationId
        programID
        schoolName
        schoolType
        score
        status
        studentCPR
        studentName
        universityApplicationsId
        universityID
        verifiedGPA
        programs {
          items {
            program {
              id
              name
              nameAr
              university {
                name
                nameAr
                id
              }
            }
          }
        }
      }
    }
  }
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  if (res.data === null) {
    throw new Error(`Failed to get the scholarship with id: ${id}`);
  }

  let scholarship = res.data?.getScholarship;

  return scholarship;
}

export async function createSingleBatch(
  variables: CreateBatchMutationVariables
): Promise<CreateBatchMutation | undefined> {
  let res = (await API.graphql({
    query: createBatch,
    variables: variables,
  })) as GraphQLResult<CreateBatchMutation>;

  return res.data;
}

export async function createSingleMasterBatch(
  variables: CreateMasterBatchMutationVariables
): Promise<CreateMasterBatchMutation | undefined> {
  let res = (await API.graphql({
    query: createMasterBatch,
    variables: variables,
  })) as GraphQLResult<CreateMasterBatchMutation>;

  return res.data;
}
export async function updateSingleBatch(
  variables: UpdateBatchMutationVariables
): Promise<UpdateBatchMutation | undefined> {
  let res = (await API.graphql({
    query: updateBatch,
    variables: variables,
  })) as GraphQLResult<UpdateBatchMutation>;

  return res.data;
}
export async function updateSingleMasterBatch(
  variables: UpdateMasterBatchMutationVariables
): Promise<UpdateMasterBatchMutation | undefined> {
  let res = (await API.graphql({
    query: updateMasterBatch,
    variables: variables,
  })) as GraphQLResult<UpdateMasterBatchMutation>;

  return res.data;
}
export async function updateParentInfoData(
  variables: UpdateParentInfoMutationVariables
): Promise<UpdateParentInfoMutation | undefined> {
  let res = (await API.graphql({
    query: updateParentInfo,
    variables: variables,
  })) as GraphQLResult<UpdateParentInfoMutation>;

  return res.data;
}

export async function updateStudentInDB(
  mutationVars: UpdateStudentMutationVariables
): Promise<UpdateStudentMutation | undefined> {
  let res = (await API.graphql({
    query: updateStudent,
    variables: mutationVars,
  })) as GraphQLResult<UpdateStudentMutation>;

  return res.data;
}

export async function listAllBahrainUniversities() {
  let q = `
  query ListAllBahrainUniversities {
    listBahrainUniversities(limit: 9999999) {
      items {
        id
        universityName
        universityNameAr
        availability
        isDeactivated
        _version
        _deleted
      }
    }
  }
`;

  let res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>; // your fetch function here

  let universities = res.data?.listBahrainUniversities
    .items as BahrainUniversities[];
  return universities;
}

export async function listAllMasterUniversities() {
  let q = `
  query ListAllMasterAppliedUniversities {
  listMasterAppliedUniversities(limit:9999999){
    items {
      id
      universityName
      universityNameAr
      availability
      isDeactivated
      _version
      _deleted
    }
  }
}
`;

  let res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>; // your fetch function here

  let universities = res.data?.listMasterAppliedUniversities
    .items as MasterAppliedUniversities[];
  return universities;
}

/* -------------------------------------------------------------------------- */
/*                                 Statistics                                 */
/* -------------------------------------------------------------------------- */

type TGetStatistics = {
  batch: number;
  token?: string | null;
  locale?: string | null;
};

export async function getStatistics({ token, batch, locale }: TGetStatistics) {
  if (!token) {
    return null;
  }

  return await fetch(
    `${process.env.NEXT_PUBLIC_BACHELOR_STATISTICS_ENDPOINT}?batch=${batch}`,
    // `https://a69a50c47l.execute-api.us-east-1.amazonaws.com/default/applications/statistics?batch=${batch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale ? locale : "en",
      },
    }
  ).then((res) => res.json().then((data) => data.statistics as TStatistics));
}

export async function getMastersStatistics({
  token,
  batch,
  locale,
}: TGetStatistics) {
  if (!token) {
    return null;
  }

  return await fetch(
    `${process.env.NEXT_PUBLIC_MASTERS_STATISTICS_ENDPOINT}?batch=${batch}`,
    // `https://a69a50c47l.execute-api.us-east-1.amazonaws.com/default/applications/statistics?batch=${batch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": locale ? locale : "en",
      },
    }
  ).then((res) => res.json().then((data) => data.statistics as TStatistics));
}
