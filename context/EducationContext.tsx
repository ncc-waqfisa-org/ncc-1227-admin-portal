import { API, graphqlOperation } from "aws-amplify";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { ListUniversitiesQuery, Program, University } from "../src/API";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { getUniversityByID } from "../src/CustomAPI";

interface IUseEducationContext {
  universityList: University[] | undefined;
  universityPrograms: University | undefined;
  programsList: Program[] | undefined;
  addNewUniversity: (name: string) => Promise<University | undefined>;
  getProgramsFromUniID: (id: string) => Promise<University | undefined>;
  addProgramToUni: (
    uniID: string,
    programName: string,
    availability: number,
    requirements: string,
    isDeactivated: boolean
  ) => Promise<Program | undefined>;
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

  useEffect(
    () => {
      // Run this
      getUniList();
      listAllPrograms();
      // on destroy
      return () => {};
    },

    // Rerun whenever anything here changes
    []
  );

  async function syncUniList() {
    await getUniList();
  }

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
          isDeactivated
          Programs {
            items {
              id
              _version
              _deleted
              _lastChangedAt
              createdAt
              availability
              name
              requirements
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
          id
          universityID
          universityProgramsId
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
    uniName?: string
  ): Promise<University | undefined> {
    let query = `
    mutation CreateUniversity {
      createUniversity(input: {name: "${uniName}"}) {
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
  async function addProgramToUni(
    uniID: string,
    programName: string,
    availability: number,
    requirements: string,
    isDeactivated: boolean
  ): Promise<Program | undefined> {
    let query = `
    mutation CreateProgramForUniversity {
      createProgram(input: {universityID: "${uniID}", name: "${programName}", availability: ${availability}, requirements: "${requirements}", universityProgramsId: "${uniID}", isDeactivated: ${isDeactivated}}) {
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
