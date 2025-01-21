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
  BahrainUniversities,
  CreateBahrainUniversitiesMutationVariables,
  CreateMasterUniversitiesMutation,
  CreateMasterUniversitiesMutationVariables,
  ListUniversitiesQuery,
  MasterUniversities,
  Program,
  University,
} from "../src/API";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import {
  createBahrainiUniversityInDb,
  createMasterUniversityInDb,
  getUniversityByID,
  listAllBahrainUniversities,
  listAllMasterUniversities,
} from "../src/CustomAPI";
import { useAuth } from "../hooks/use-auth";
import { getMasterAppliedUniversities } from "../src/graphql/queries";

interface IUseEducationContext {
  universityList: University[] | undefined;
  universityPrograms: University | undefined;
  programsList: Program[] | undefined;
  addNewUniversity: (
    name: string,
    nameAr: string,
    availability: number
  ) => Promise<University | undefined>;
  getProgramsFromUniID: (id: string) => Promise<University | undefined>;
  addProgramToUni: ({
    uniID,
    programName,
    programNameAr,
    requirements,
    requirementsAr,
    minimumGPA,
    isDeactivated,
  }: {
    uniID: string;
    programName: string;
    programNameAr: string;
    requirements: string;
    requirementsAr: string;
    minimumGPA: number;
    isDeactivated: boolean;
  }) => Promise<Program | undefined>;
  syncUniList: () => Promise<void>;
}

const defaultState: IUseEducationContext = {
  universityList: [],
  universityPrograms: undefined,
  programsList: [],
  addNewUniversity: async () => undefined,
  getProgramsFromUniID: async () => undefined,
  addProgramToUni: async () => undefined,
  syncUniList: async () => {},
};

const EducationContext = createContext<IUseEducationContext>(defaultState);

export const useEducation = () => useContext(EducationContext);

export const EducationProvider: FC<PropsWithChildren> = ({ children }) => {
  const education = useProviderEducation();
  return (
    <EducationContext.Provider value={education}>
      {children}
    </EducationContext.Provider>
  );
};

//NOTE: declare vars and functions here
function useProviderEducation() {
  const [universityList, setUniversityList] = useState<
    University[] | undefined
  >(undefined);

  const [programsList, setProgramsList] = useState<Program[] | undefined>(
    undefined
  );

  const [universityPrograms, setUniversityPrograms] = useState<
    University | undefined
  >(undefined);

  const { isSignedIn } = useAuth();

  useEffect(
    () => {
      // Run this
      if (isSignedIn) {
        getUniList();
        listAllPrograms();
      }
      // on destroy
      return () => {};
    },

    // Rerun whenever anything here changes
    [isSignedIn]
  );

  async function syncUniList() {
    await getUniList();
  }

  /* 
    MASTERS UNIVERSITY  
  */
  // async function addNewMasterUniversity(
  //   values: CreateMasterUniversitiesMutationVariables
  // ): Promise<MasterUniversities | undefined> {
  //   let res = (await createMasterUniversityInDb(
  //     values
  //   )) as GraphQLResult<MasterUniversities>;

  //   if (res.data) {
  //     await listAllMasterUniversities();
  //   }

  //   return res.data;
  // }

  // async function addNewBahrainiUniversity(
  //   values: CreateBahrainUniversitiesMutationVariables
  // ): Promise<BahrainUniversities | undefined> {
  //   let res = (await createBahrainiUniversityInDb(
  //     values
  //   )) as GraphQLResult<BahrainUniversities>;

  //   if (res.data) {
  //     await listAllBahrainUniversities();
  //   }

  //   return res.data;
  // }

  async function getUniList(): Promise<University[] | undefined> {
    let q = `
    query ListAllUni {
      listUniversities(limit: 99999999) {
        items {
          id
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
          name
          nameAr
          availability
          isDeactivated
          isException
          isExtended
          extensionDuration
          isTrashed
          Programs {
            items {
              id
              _version
              _deleted
              _lastChangedAt
              createdAt
              availability
              name
              nameAr
              requirements
              minimumGPA
              requirementsAr
              universityID
              universityProgramsId
              updatedAt
              isDeactivated
            }
          }
        }
      }
    }
    `;

    let res = (await API.graphql(
      graphqlOperation(q)
    )) as GraphQLResult<ListUniversitiesQuery>;

    let tempUniList = res.data;
    let temp: University[] = (tempUniList?.listUniversities?.items ??
      []) as University[];

    setUniversityList(temp);

    return temp;
  }

  // get all programs related to uni id
  async function listAllPrograms(): Promise<Program[] | undefined> {
    let query = `
    query ListAllPrograms {
      listPrograms(limit: 99999999) {
        items {
          name
          nameAr
          id
          universityID
          universityProgramsId
          minimumGPA
        }
      }
    }    
    `;

    let res = (await API.graphql(
      graphqlOperation(query)
    )) as GraphQLResult<any>;

    let tempProgramList = res.data;
    let temp: Program[] = (tempProgramList.listPrograms?.items ??
      []) as Program[];

    setProgramsList(temp);

    return temp;
  }

  async function addNewUniversity(
    uniName?: string,
    uniArName?: string,
    uniAvailability?: number
  ): Promise<University | undefined> {
    let query = `
    mutation CreateUniversity {
      createUniversity(input: {name: "${uniName}", nameAr: "${uniArName}", availability: ${uniAvailability}}) {
        _version
        id
        name
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
    }
    `;

    let res = (await API.graphql(
      graphqlOperation(query)
    )) as GraphQLResult<University>;

    if (res.data) {
      await getUniList();
    }

    return res.data;
  }

  // get all programs related to uni id
  async function getProgramsFromUniID(
    id?: string
  ): Promise<University | undefined> {
    let tempProgramList = await getUniversityByID(id);
    setUniversityPrograms(tempProgramList);
    return tempProgramList;
  }

  // add programs to uni
  async function addProgramToUni({
    uniID,
    programName,
    programNameAr,
    requirements,
    requirementsAr,
    minimumGPA,
    isDeactivated,
  }: {
    uniID: string;
    programName: string;
    programNameAr: string;
    requirements: string;
    requirementsAr: string;
    minimumGPA: number;
    isDeactivated: boolean;
  }): Promise<Program | undefined> {
    let query = `
    mutation CreateProgramForUniversity {
      createProgram(input: {universityID: "${uniID}",
       name: "${programName}",
       nameAr: "${programNameAr}",
       requirements: "${requirements}",
       requirementsAr: "${requirementsAr}",
       universityProgramsId: "${uniID}", 
       minimumGPA: ${minimumGPA}, 
       isDeactivated: ${isDeactivated}}) {
        name
        _deleted
        _lastChangedAt
        _version
        availability
        createdAt
        id
        requirements
        universityID
        universityProgramsId
        minimumGPA
        updatedAt
      }
    }
    `;

    let res = (await API.graphql(
      graphqlOperation(query)
    )) as GraphQLResult<Program>;

    if (res.data === null) {
      throw new Error("Failed to add the program to university");
    }

    if (res.data) {
      await getUniList();
    }

    return res.data;
  }

  // NOTE: return all the values & functions you want to export
  return {
    universityPrograms,
    universityList,
    addNewUniversity,
    getProgramsFromUniID,
    addProgramToUni,
    programsList,
    syncUniList,
  };
}
