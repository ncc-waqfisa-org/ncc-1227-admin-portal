import { API, graphqlOperation } from "aws-amplify";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ApplicantType,
  Application,
  MasterApplication,
  Student,
} from "../src/API";
import { GraphQLResult } from "@aws-amplify/api-graphql";

import {
  getAllApplicationsLambda,
  getAllMasterApplicationsLambda,
} from "../src/CustomAPI";
import { useAuth } from "../hooks/use-auth";
import { useBatchContext } from "./BatchContext";

// interface for all the values & functions
interface IUseStudentContext {
  // Bachelor
  applications: Application[] | undefined;
  applicationById: Application | undefined;
  getApplicationByID: (id: string) => void;
  syncApplications: () => Promise<void>;
  syncUpdatedApplication: (updatedApplication: Application) => Promise<void>;
  applicationsBeingFetched: boolean;
  // Master
  masterApplications: MasterApplication[] | undefined;
  masterApplicationById: MasterApplication | undefined;
  getMasterApplicationByID: (id: string) => void;
  syncMasterApplications: () => Promise<void>;
  syncUpdatedMasterApplication: (
    updatedMasterApplication: MasterApplication
  ) => Promise<void>;
  masterApplicationsBeingFetched: boolean;
  // Shared
  getStudentInfo: (cpr: string) => Promise<Student | undefined>;
  batch: number;
  updateBatch: (batch: number) => void;
  applicantType: {
    isMaster: boolean;
    isBachelor: boolean;
    isBoth: boolean;
  };
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
  masterApplications: undefined,
  masterApplicationById: undefined,
  getMasterApplicationByID: function (id: string): void {
    throw new Error("Function not implemented.");
  },
  syncMasterApplications: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  syncUpdatedMasterApplication: function (
    updatedMasterApplication: MasterApplication
  ): Promise<void> {
    throw new Error("Function not implemented.");
  },
  masterApplicationsBeingFetched: false,
  applicantType: {
    isMaster: false,
    isBachelor: false,
    isBoth: false,
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

  const [masterApplications, setMasterApplications] = useState<
    MasterApplication[] | undefined
  >(defaultState.masterApplications);

  // const [batch, setBatch] = useState<number>(defaultState.batch);

  const [applicationById, setApplicationById] = useState<
    Application | undefined
  >(defaultState.applicationById);

  const [masterApplicationById, setMasterApplicationById] = useState<
    MasterApplication | undefined
  >(defaultState.masterApplicationById);

  const [applicationsBeingFetched, setApplicationsBeingFetched] = useState(
    defaultState.applicationsBeingFetched
  );
  const [masterApplicationsBeingFetched, setMasterApplicationsBeingFetched] =
    useState(defaultState.masterApplicationsBeingFetched);

  const { isSignedIn } = useAuth();

  const [applicantType, setApplicantType] = useState(
    defaultState.applicantType
  );

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

  async function getAllMasterApplications(
    batch: number
  ): Promise<MasterApplication[]> {
    // let tempApplicationList = await getAllApplicationsAPI(batch);
    setMasterApplicationsBeingFetched(true);

    let tempMasterApplicationList = await getAllMasterApplicationsLambda(
      batch
    ).finally(() => {
      setMasterApplicationsBeingFetched(false);
    });
    setMasterApplications(tempMasterApplicationList);
    return tempMasterApplicationList;
  }

  // get application by id
  async function getApplicationByID(
    id: string
  ): Promise<Application | undefined> {
    let tempApplication = await getApplicationByIdAPI(id);
    setApplicationById(tempApplication);

    return tempApplication;
  }
  async function getMasterApplicationByID(
    id: string
  ): Promise<MasterApplication | undefined> {
    let tempMasterApplication = await getMasterApplicationByIdAPI(id);
    setMasterApplicationById(tempMasterApplication);

    return tempMasterApplication;
  }

  async function syncApplications() {
    await getAllApplications(batch);
  }
  async function syncMasterApplications() {
    await getAllMasterApplications(batch);
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

  async function syncUpdatedMasterApplication(
    updatedMasterApplication: MasterApplication
  ) {
    const tempMasterApplications: MasterApplication[] = [
      ...(masterApplications ?? []),
    ];

    const appIndex = tempMasterApplications.findIndex(
      (app) => app.id === updatedMasterApplication.id
    );

    const tempApp: MasterApplication = {
      ...tempMasterApplications[appIndex],
      status: updatedMasterApplication.status,
    };

    tempMasterApplications.splice(appIndex, 1, tempApp);

    setMasterApplications(tempMasterApplications);
  }

  async function getStudentInfo(cpr: string): Promise<Student | undefined> {
    setApplicantType(defaultState.applicantType);
    let query = `
    query GetStudent {
  getStudent(cpr: "${cpr}") {
    cpr
    cprDoc
    firstName
    secondName
    thirdName
    lastName
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
    dob
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
    m_firstName
    m_secondName
    m_lastName
    m_numberOfFamilyMembers
    m_graduationYear
    m_university {
      isDeactivated
      universityName
      universityNameAr
      id
      _version
    }
    m_universityID
    m_oldProgram
    m_applicantType
    m_isEmployed
    m_placeOfEmployment
    m_income
    m_incomeDoc
    m_guardianCPR
    m_guardianFullName
    m_guardianCPRDoc
    m_masterApplications {
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

    const student = tempStudent.getStudent
      ? (tempStudent.getStudent as Student)
      : undefined;

    if (student) {
      const isMaster = student.m_applicantType?.includes(ApplicantType.MASTER) ?? false;
      const isBachelor = student.m_applicantType?.includes(
        ApplicantType.STUDENT
      ) ?? false;
      const isBoth = isMaster && isBachelor;

      setApplicantType({ isMaster, isBachelor, isBoth });
    } else {
      setApplicantType(defaultState.applicantType);
    }

    return student;
  }

  // NOTE: return all the values & functions you want to export
  return {
    applications,
    applicationById,
    getApplicationByID,
    batch,
    updateBatch,
    syncApplications,
    getStudentInfo,
    applicationsBeingFetched,
    syncUpdatedApplication,
    masterApplications,
    masterApplicationById,
    getMasterApplicationByID,
    syncMasterApplications,
    syncUpdatedMasterApplication,
    applicantType,
    masterApplicationsBeingFetched,
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
      reason
      batch
      familyIncome
      studentName
      allProgramsTextOption
      nationalityCategory
      isFamilyIncomeVerified
      adminPoints
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
          id
            name
            nameAr
            minimumGPA
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
    program {
      id
      _version 
            name
            nameAr
            minimumGPA
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
          guardianFirstName
          guardianSecondName
          guardianThirdName
          guardianLastName
          motherCPR
          id
          motherFullName
          numberOfFamilyMembers
          primaryMobile
          relation
          secondaryMobile
          updatedAt
        }
        dob
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
        firstName
        secondName
        thirdName
        lastName
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

export async function getMasterApplicationByIdAPI(
  id: string
): Promise<MasterApplication | undefined> {
  let query = `
  query GetMasterApplicationForAdmin {
  getMasterApplication(id: "${id}") {
    _version
    _deleted
    id
    gpa
    dateTime
    batch
    createdAt
    adminPoints
    income
    incomeDoc
    isEmailSent
    isIncomeVerified
    major
    masterApplicationAttachmentId
    nationalityCategory
    processed
    program
    reason
    score
    status
    student {
      cpr
      cprDoc
      gender
      email
      nationalityCategory
      phone
      preferredLanguage
      placeOfBirth
      address
      m_firstName
      m_secondName
      m_thirdName
      m_lastName
      m_numberOfFamilyMembers
      m_graduationYear
      m_university {
        isDeactivated
        universityName
        universityNameAr
        id
        _version
      }
      m_universityID
      m_oldProgram
      m_applicantType
      m_isEmployed
      m_placeOfEmployment
      m_income
      m_incomeDoc
      m_guardianCPR
      m_guardianFirstName
      m_guardianSecondName
      m_guardianThirdName
      m_guardianLastName
      m_guardianCPRDoc
      dob
    }
    studentCPR
    studentName
    universityID
    verifiedGPA
    attachment {
      _version
      id
      acceptanceLetterDoc
      cprDoc
      signedContractDoc
      toeflIELTSCertificate
      transcriptDoc
      universityCertificate
    }
    masterLogs {
      items {
        id
        _version
        _deleted
        applicationID
        createdAt
        dateTime
        masterApplicationMasterLogsId
        reason
        snapshot
        studentCPR
        studentM_MasterLogsCpr
      }
    }
    adminLogs {
      items {
        adminAdminLogsCpr
        adminCPR
        applicationID
        dateTime
        snapshot
        reason
        createdAt
      }
    }
    university {
      _version
      id
      universityName
      universityNameAr
      isDeactivated
    }
  }
}
  `;

  let res = (await API.graphql(graphqlOperation(query))) as GraphQLResult<any>;

  let tempMasterApplication = res.data;

  if (res.data === null) {
    throw new Error("Failed to get all applications");
  }

  return tempMasterApplication.getMasterApplication as MasterApplication;
}
