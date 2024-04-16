import { API, graphqlOperation } from "aws-amplify";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Application, Student } from "../src/API";
import { GraphQLResult } from "@aws-amplify/api-graphql";

import { getAllApplicationsLambda } from "../src/CustomAPI";
import { useAuth } from "../hooks/use-auth";
import { useBatchContext } from "./BatchContext";

// interface for all the values & functions
interface IUseStudentContext {
  applications: Application[] | undefined;
  applicationById: Application | undefined;
  getApplicationByID: (id: string) => void;
  getStudentInfo: (cpr: string) => Promise<Student | undefined>;
  batch: number;
  updateBatch: (batch: number) => void;
  syncApplications: () => Promise<void>;
  syncUpdatedApplication: (updatedApplication: Application) => Promise<void>;
  applicationsBeingFetched: boolean;
}

// the default state for all the values & functions
const defaultState: IUseStudentContext = {
  applications: undefined,
  applicationById: undefined,
  getApplicationByID: () => {},
  batch: new Date().getFullYear(),
  updateBatch: function (): void {
    throw new Error("Function not implemented.");
  },
  syncApplications: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getStudentInfo: function (cpr: string): Promise<Student | undefined> {
    throw new Error("Function not implemented.");
  },
  applicationsBeingFetched: false,
  syncUpdatedApplication: function (
    updatedApplication: Application
  ): Promise<void> {
    throw new Error("Function not implemented.");
  },
};

// creating the app contexts
const StudentContext = createContext<IUseStudentContext>(defaultState);

// Access Student values and functions with custom useStudentContext hook
export const useStudent = () => useContext(StudentContext);

// The Student provider to wrap the components that will use the context
export const StudentProvider: FC<PropsWithChildren> = ({ children }) => {
  const student = useProviderStudent();
  return (
    <StudentContext.Provider value={student}>
      {children}
    </StudentContext.Provider>
  );
};

//NOTE: declare vars and functions here
function useProviderStudent() {
  const { batch, setBatch } = useBatchContext();

  const [applications, setApplications] = useState<Application[] | undefined>(
    defaultState.applications
  );

  // const [batch, setBatch] = useState<number>(defaultState.batch);

  const [applicationById, setApplicationById] = useState<
    Application | undefined
  >(undefined);

  const [applicationsBeingFetched, setApplicationsBeingFetched] = useState(
    defaultState.applicationsBeingFetched
  );

  const { isSignedIn } = useAuth();

  useEffect(
    () => {
      // Run this
      if (isSignedIn) {
        // getAllApplications(batch);
      }

      // on destroy
      return () => {};
    },

    // Re-run whenever anything here changes
    [batch, isSignedIn]
  );

  function updateBatch(newBatch: number) {
    setBatch(newBatch);
  }

  async function getAllApplications(batch: number): Promise<Application[]> {
    // let tempApplicationList = await getAllApplicationsAPI(batch);
    setApplicationsBeingFetched(true);
    let tempApplicationList = await getAllApplicationsLambda(batch).finally(
      () => {
        setApplicationsBeingFetched(false);
      }
    );
    setApplications(tempApplicationList);
    return tempApplicationList;
  }

  // get application by id
  async function getApplicationByID(
    id: string
  ): Promise<Application | undefined> {
    let tempApplication = await getApplicationByIdAPI(id);
    setApplicationById(tempApplication);

    return tempApplication;
  }

  async function syncApplications() {
    await getAllApplications(batch);
  }

  /**
   * The function syncUpdatedApplication updates the status of an application in a list of
   * applications.
   * @param {Application} updatedApplication - The `updatedApplication` parameter is an object of type
   * `Application` that represents the updated application.
   */
  async function syncUpdatedApplication(updatedApplication: Application) {
    const tempApplications: Application[] = [...(applications ?? [])];

    const appIndex = tempApplications.findIndex(
      (app) => app.id === updatedApplication.id
    );

    const tempApp: Application = {
      ...tempApplications[appIndex],
      status: updatedApplication.status,
    };

    tempApplications.splice(appIndex, 1, tempApp);

    setApplications(tempApplications);
  }

  async function getStudentInfo(cpr: string): Promise<Student | undefined> {
    let query = `
    query GetStudent {
      getStudent(cpr: "${cpr}") {
        cpr
        cprDoc
        _deleted
        _version
        email
        familyIncome
        familyIncomeProofDocs
        fullName
        gender
        graduationDate
        nationality
        nationalityCategory
        phone
        placeOfBirth
        preferredLanguage
        schoolName
        schoolType
        specialization
        studentOrderAmongSiblings
        address
        ParentInfo {
          id
          _version
          _deleted
          address
          fatherCPR
          fatherFullName
          guardianCPR
          guardianFullName
          motherCPR
          motherFullName
          numberOfFamilyMembers
          primaryMobile
          relation
          secondaryMobile
        }
        applications {
          items {
            id
            _deleted
            status
            gpa
            dateTime
            updatedAt
            isEmailSent
          }
        }
      }
    }  
    `;

    let res = (await API.graphql(
      graphqlOperation(query)
    )) as GraphQLResult<any>;

    let tempStudent = res.data;

    if (res.data === null) {
      throw new Error("Failed to get student");
    }

    return tempStudent.getStudent
      ? (tempStudent.getStudent as Student)
      : undefined;
  }

  // NOTE: return all the values & functions you want to export
  return {
    applications,
    applicationById,
    getApplicationByID,
    batch: batch,
    updateBatch: updateBatch,
    syncApplications,
    getStudentInfo,
    applicationsBeingFetched,
    syncUpdatedApplication,
  };
}

export async function getApplicationByIdAPI(
  id: string
): Promise<Application | undefined> {
  let query = `
  query GetApplicationInfo {
    getApplication(id: "${id}") {
      schoolType
      schoolName
      _deleted
      _lastChangedAt
      _version
      adminLogs {
        items {
          adminAdminLogsCpr
          adminCPR
          applicationID
          dateTime
          snapshot
        }
      }
      attachment {
        schoolCertificate
        cprDoc
        id
        _version
        signedContractDoc
        transcriptDoc
        updatedAt
      }
      attachmentID
      gpa
      verifiedGPA
      id
      programs {
        items {
          id
          _version
          choiceOrder
          programID
          acceptanceLetterDoc
          program {
            name
            nameAr
            university {
              name
              nameAr
              isException
              isExtended
              extensionDuration
              isTrashed
              isDeactivated
            }
          }
        }
      }
      status
      studentCPR
      studentLogs {
        items {
          _deleted
          _lastChangedAt
          applicationID
          _version
          applicationStudentLogsId
          createdAt
          dateTime
          id
          reason
          snapshot
          studentCPR
          updatedAt
        }
      }
      student {
        ParentInfo {
          address
          fatherCPR
          fatherFullName
          guardianCPR
          guardianFullName
          motherCPR
          id
          motherFullName
          numberOfFamilyMembers
          primaryMobile
          relation
          secondaryMobile
          updatedAt
        }
        _deleted
        _version
        address
        cpr
        cprDoc
        fullName
        gender
        createdAt
        email
        graduationDate
        phone
        placeOfBirth
        preferredLanguage
        schoolName
        specialization
        studentOrderAmongSiblings
        familyIncome
        familyIncomeProofDocs
        nationality
        nationalityCategory
        schoolType
      }
      updatedAt
      createdAt
      isEmailSent
    }
  }  
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  let tempApplication = res.data;

  if (res.data === null) {
    throw new Error("Failed to get all applications");
  }

  return tempApplication.getApplication as Application;
}
