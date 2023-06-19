import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  Admin,
  AdminLog,
  Application,
  CreateAdminLogMutation,
  CreateAdminLogMutationVariables,
  CreateApplicationMutation,
  CreateApplicationMutationVariables,
  CreateAttachmentMutation,
  CreateAttachmentMutationVariables,
  CreateProgramChoiceMutation,
  CreateProgramChoiceMutationVariables,
  CreateStudentLogMutation,
  CreateStudentLogMutationVariables,
  Program,
  StudentLog,
  University,
  UpdateApplicationMutation,
  UpdateApplicationMutationVariables,
  UpdateAttachmentMutation,
  UpdateAttachmentMutationVariables,
  UpdateProgramChoiceMutation,
  UpdateProgramChoiceMutationVariables,
  UpdateProgramMutation,
  UpdateProgramMutationVariables,
  UpdateUniversityMutation,
  UpdateUniversityMutationVariables,
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
} from "./graphql/mutations";

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
                      requirements
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
        requirements
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
export async function uploadFile(file: File, type: DocType, cpr: string) {
  try {
    let res = await Storage.put(
      `Student${cpr}/${cpr}#${DocType[type]}#${new Date().getDate()}`,
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
      fullName
    }
  }
      `;

  const res = (await API.graphql(graphqlOperation(q))) as GraphQLResult<any>;

  if (res.data === undefined || res.data === null) {
    return undefined;
  }

  let admin = res.data as Admin;

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
      requirements
      university {
        name
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
      _version
      name
      updatedAt
      id
      createdAt
      _lastChangedAt
      _deleted
      isDeactivated 
      Programs {
        items {
          isDeactivated
          name
          requirements
          universityID
          universityProgramsId
          updatedAt
          createdAt
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
          householdIncome
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
          householdIncome
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
