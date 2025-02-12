import dayjs from "dayjs";
import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  InfiniteApplication,
  TInfiniteApplications,
  NextStartKey,
  InfiniteMasterApplication,
  TInfiniteMasterApplications,
} from "../components/ui/applications/infinite-applications-type";

import { useAuth } from "../hooks/use-auth";
import { MasterApplication, MasterScholarship, Scholarship } from "../src/API";
import {
  listAllMastersScholarshipsOfBatch,
  listAllScholarshipsOfBatch,
} from "../src/CustomAPI";
import { String } from "aws-sdk/clients/acm";

// interface for all the values & functions
interface IUseBatchContext {
  applicationsData: InfiniteApplication[];
  setApplicationsData: Dispatch<SetStateAction<InfiniteApplication[]>>;

  scholarshipsData: Scholarship[];
  setScholarshipsData: Dispatch<SetStateAction<Scholarship[]>>;

  nextScholarshipsKey: string | null;
  searchedCpr: string;
  setNextScholarshipsKey: Dispatch<SetStateAction<string | null>>;

  nextApplicationsKey: NextStartKey | undefined;
  setNextApplicationsKey: Dispatch<SetStateAction<NextStartKey | undefined>>;
  resetScholarships: () => void;
  resetApplications: () => void;
  resetApplicationsFilter: () => void;
  searchCpr: (cpr: string) => void;
  isInitialFetching: boolean;
  isScholarshipsInitialFetching: boolean;
  batch: number;
  setBatch: Dispatch<SetStateAction<number>>;
  selectedApplicationsStatus: string | undefined;
  setSelectedApplicationsStatus: Dispatch<SetStateAction<string | undefined>>;

  // ? Masters fields
  isMasterInitialFetching: boolean;
  setIsMasterInitialFetching: Dispatch<SetStateAction<boolean>>;
  mastersBatch: number;
  setMastersBatch: Dispatch<SetStateAction<number>>;
  masterApplicationsData: InfiniteMasterApplication[];
  setMasterApplicationsData: Dispatch<
    SetStateAction<InfiniteMasterApplication[]>
  >;
  nextMasterApplicationsKey: NextStartKey | undefined;
  setNextMasterApplicationsKey: Dispatch<
    SetStateAction<NextStartKey | undefined>
  >;
  resetMasterApplications: () => void;
  searchMasterCpr: (cpr: string) => void;
  updateMasterApplication(updatedApplication: InfiniteMasterApplication): void;

  // ? Masters scholarship
  masterScholarshipsData: MasterScholarship[];
  setMasterScholarshipsData: Dispatch<SetStateAction<MasterScholarship[]>>;
  nextMasterScholarshipsKey: string | null;
  setNextMasterScholarshipsKey: Dispatch<SetStateAction<string | null>>;
  resetMasterScholarships: () => void;
  isMasterScholarshipsInitialFetching: boolean;
}

// the default state for all the values & functions
const defaultState: IUseBatchContext = {
  batch: dayjs().year(),
  setBatch: function (value: SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  },
  selectedApplicationsStatus: undefined,
  setSelectedApplicationsStatus: function (
    value: SetStateAction<string | undefined>
  ): void {
    throw new Error("Function not implemented.");
  },
  applicationsData: [],
  setApplicationsData: function (
    value: SetStateAction<InfiniteApplication[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  nextApplicationsKey: undefined,
  setNextApplicationsKey: function (
    value: SetStateAction<NextStartKey | undefined>
  ): void {
    throw new Error("Function not implemented.");
  },
  isInitialFetching: false,
  resetApplications: function (): void {
    throw new Error("Function not implemented.");
  },
  resetApplicationsFilter: function (): void {
    throw new Error("Function not implemented.");
  },
  nextScholarshipsKey: null,
  setNextScholarshipsKey: function (
    value: SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  scholarshipsData: [],
  setScholarshipsData: function (value: SetStateAction<Scholarship[]>): void {
    throw new Error("Function not implemented.");
  },
  resetScholarships: function (): void {
    throw new Error("Function not implemented.");
  },
  isScholarshipsInitialFetching: false,
  searchCpr: function (cpr: string): void {
    throw new Error("Function not implemented.");
  },
  searchedCpr: "",

  isMasterInitialFetching: false,
  mastersBatch: dayjs().year(),
  masterApplicationsData: [],
  setMasterApplicationsData: function (
    value: SetStateAction<InfiniteMasterApplication[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  nextMasterApplicationsKey: undefined,
  setNextMasterApplicationsKey: function (
    value: SetStateAction<NextStartKey | undefined>
  ): void {
    throw new Error("Function not implemented.");
  },
  resetMasterApplications: function (): void {
    throw new Error("Function not implemented.");
  },
  searchMasterCpr: function (cpr: string): void {
    throw new Error("Function not implemented.");
  },
  setIsMasterInitialFetching: function (value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  },
  setMastersBatch: function (value: SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  },
  updateMasterApplication: function (
    updatedApplication: InfiniteMasterApplication
  ): void {
    throw new Error("Function not implemented.");
  },
  masterScholarshipsData: [],
  setMasterScholarshipsData: function (
    value: SetStateAction<MasterScholarship[]>
  ): void {
    throw new Error("Function not implemented.");
  },
  nextMasterScholarshipsKey: null,
  setNextMasterScholarshipsKey: function (
    value: SetStateAction<string | null>
  ): void {
    throw new Error("Function not implemented.");
  },
  resetMasterScholarships: function (): void {
    throw new Error("Function not implemented.");
  },
  isMasterScholarshipsInitialFetching: false,
};

// creating the app contexts
const BatchContext = createContext<IUseBatchContext>(defaultState);

// Access app values and functions with custom useAppContext hook
export const useBatchContext = () => useContext(BatchContext);

// The App provider to wrap the components that will use the context
export const BatchProvider: FC<PropsWithChildren> = ({ children }) => {
  const app = useBatchProviderApp();
  return <BatchContext.Provider value={app}>{children}</BatchContext.Provider>;
};

//NOTE: declare vars and functions here
function useBatchProviderApp() {
  const { token } = useAuth();

  const [isInitialFetching, setIsInitialFetching] = useState(
    defaultState.isInitialFetching
  );

  const [isScholarshipsInitialFetching, setIsScholarshipsInitialFetching] =
    useState(defaultState.isScholarshipsInitialFetching);

  const [
    isMasterScholarshipsInitialFetching,
    setIsMasterScholarshipsInitialFetching,
  ] = useState(defaultState.isMasterScholarshipsInitialFetching);

  const [batch, setBatch] = useState<number>(defaultState.batch);

  const [nextApplicationsKey, setNextApplicationsKey] = useState<
    NextStartKey | undefined
  >(defaultState.nextApplicationsKey);

  const [nextScholarshipsKey, setNextScholarshipsKey] = useState<string | null>(
    defaultState.nextScholarshipsKey
  );

  const [nextMasterScholarshipsKey, setNextMasterScholarshipsKey] = useState<
    string | null
  >(defaultState.nextMasterScholarshipsKey);

  const [selectedApplicationsStatus, setSelectedApplicationsStatus] = useState<
    string | undefined
  >(defaultState.selectedApplicationsStatus);

  const [applicationsData, setApplicationsData] = useState(
    defaultState.applicationsData
  );
  const [scholarshipsData, setScholarshipsData] = useState(
    defaultState.scholarshipsData
  );

  const [masterScholarshipsData, setMasterScholarshipsData] = useState(
    defaultState.masterScholarshipsData
  );

  const [cpr, setCpr] = useState("");

  const [isMasterInitialFetching, setIsMasterInitialFetching] = useState(
    defaultState.isMasterInitialFetching
  );

  const [mastersBatch, setMastersBatch] = useState<number>(
    defaultState.mastersBatch
  );

  const [nextMasterApplicationsKey, setNextMasterApplicationsKey] = useState<
    NextStartKey | undefined
  >(defaultState.nextMasterApplicationsKey);

  const [masterApplicationsData, setMasterApplicationsData] = useState(
    defaultState.masterApplicationsData
  );

  function searchCpr(newCpr: string) {
    setCpr(newCpr);
    resetApplications(newCpr);
  }

  function resetScholarships() {
    setNextScholarshipsKey(null);
    setScholarshipsData([]);
    fetchFirstScholarshipsPage();
  }

  function resetMasterScholarships() {
    setNextMasterScholarshipsKey(null);
    setMasterScholarshipsData([]);
    fetchFirstMasterScholarshipsPage();
  }

  function resetApplications(newCPR?: string) {
    setNextApplicationsKey(undefined);
    setApplicationsData([]);
    fetchFirstApplicationsPage(newCPR);
  }

  async function fetchFirstApplicationsPage(newCPR?: string) {
    const batchQuery = batch ? `batch=${batch}` : "";
    const statusQuery = selectedApplicationsStatus
      ? `&status=${selectedApplicationsStatus}`
      : "";
    const searchQuery = newCPR && newCPR != "" ? `&cpr=${newCPR}` : "";
    setIsInitialFetching(true);

    const fetchedData = (await fetch(
      `${process.env.NEXT_PUBLIC_LAMBDA_GET_BACHELOR_APPLICATION}?${batchQuery}${statusQuery}${searchQuery}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((d) => d.json())
      .finally(() => {
        setIsInitialFetching(false);
      })) as TInfiniteApplications;
    setApplicationsData(fetchedData.data ?? []);
    setNextApplicationsKey(fetchedData.nextStartKey);
    return fetchedData;
  }

  async function fetchFirstScholarshipsPage() {
    setIsInitialFetching(true);
    const fetchedData = await listAllScholarshipsOfBatch({
      batch,
      nextToken: nextScholarshipsKey,
    }).finally(() => {
      setIsInitialFetching(false);
    });
    setScholarshipsData(fetchedData.items);
    setNextScholarshipsKey(fetchedData.nextToken);
    return fetchedData;
  }

  async function fetchFirstMasterScholarshipsPage() {
    setIsMasterInitialFetching(true);
    const fetchedData = await listAllMastersScholarshipsOfBatch({
      batch,
      nextToken: nextMasterScholarshipsKey,
    }).finally(() => {
      setIsMasterInitialFetching(false);
    });
    setMasterScholarshipsData(fetchedData.items);
    setNextMasterScholarshipsKey(fetchedData.nextToken);
    return fetchedData;
  }

  function resetApplicationsFilter() {
    setNextApplicationsKey(undefined);
    setApplicationsData([]);
    setSelectedApplicationsStatus(undefined);
  }

  useEffect(() => {
    setNextApplicationsKey(undefined);
    setApplicationsData([]);

    return () => {};
  }, [batch, mastersBatch, selectedApplicationsStatus]);

  useEffect(() => {
    if (token) {
      fetchFirstScholarshipsPage();
    }

    async function fetchFirstScholarshipsPage() {
      setIsInitialFetching(true);
      const fetchedData = await listAllScholarshipsOfBatch({
        batch,
        nextToken: nextScholarshipsKey,
      }).finally(() => {
        setIsInitialFetching(false);
      });
      setScholarshipsData(fetchedData.items);
      setNextScholarshipsKey(fetchedData.nextToken);
      return fetchedData;
    }

    return () => {};
  }, [batch, nextScholarshipsKey, token]);

  useEffect(() => {
    if (token) {
      fetchFirstMasterScholarshipsPage();
    }

    async function fetchFirstMasterScholarshipsPage() {
      setIsMasterInitialFetching(true);
      const fetchedData = await listAllMastersScholarshipsOfBatch({
        batch,
        nextToken: nextMasterScholarshipsKey,
      }).finally(() => {
        setIsMasterInitialFetching(false);
      });
      setMasterScholarshipsData(fetchedData.items);
      setNextMasterScholarshipsKey(fetchedData.nextToken);
      return fetchedData;
    }

    return () => {};
  }, [batch, nextMasterScholarshipsKey, token]);

  useEffect(() => {
    if (token) {
      fetchFirstApplicationsPage();
    }
    async function fetchFirstApplicationsPage() {
      const batchQuery = batch ? `batch=${batch}` : "";
      const statusQuery = selectedApplicationsStatus
        ? `&status=${selectedApplicationsStatus}`
        : "";
      setIsInitialFetching(true);
      const fetchedData = (await fetch(
        `${process.env.NEXT_PUBLIC_LAMBDA_GET_BACHELOR_APPLICATION}?${batchQuery}${statusQuery}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((d) => d.json())
        .finally(() => {
          setIsInitialFetching(false);
        })) as TInfiniteApplications;
      setApplicationsData(fetchedData.data ?? []);
      setNextApplicationsKey(fetchedData.nextStartKey);
      return fetchedData;
    }

    return () => {};
  }, [batch, selectedApplicationsStatus, token]);

  /* -------------------------------------------------------------------------- */
  /*                                   MASTERS                                  */
  /* -------------------------------------------------------------------------- */

  function resetMasterApplications(newCPR?: String) {
    setNextMasterApplicationsKey(undefined);
    setMasterApplicationsData([]);
    fetchFirstMasterApplicationsPage(newCPR);
  }

  function searchMasterCpr(newCpr: string) {
    setCpr(newCpr);
    resetMasterApplications(newCpr);
  }

  function updateMasterApplication(
    updatedApplication: InfiniteMasterApplication
  ) {
    const index = masterApplicationsData.findIndex(
      (app) => app.id === updatedApplication.id
    );

    if (index !== -1) {
      masterApplicationsData[index] = updatedApplication;
      console.log("Application updated successfully:", masterApplicationsData);
    } else {
      console.log("Application not found");
    }
  }

  async function fetchFirstMasterApplicationsPage(newCPR?: string) {
    const batchQuery = mastersBatch ? `batch=${mastersBatch}` : "";
    const statusQuery = selectedApplicationsStatus
      ? `&status=${selectedApplicationsStatus}`
      : "";

    const searchQuery = newCPR && newCPR != "" ? `&cpr=${newCPR}` : "";
    // setIsInitialFetching(true);

    setIsMasterInitialFetching(true);

    const fetchedData = (await fetch(
      `${process.env.NEXT_PUBLIC_LAMBDA_GET_MASTERS_APPLICATION}?${batchQuery}${statusQuery}${searchQuery}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((d) => d.json())
      .finally(() => {
        setIsMasterInitialFetching(false);
      })) as TInfiniteMasterApplications;
    setMasterApplicationsData(fetchedData.data ?? []);
    setNextMasterApplicationsKey(fetchedData.nextStartKey);

    return fetchedData;
  }

  useEffect(() => {
    if (token) {
      fetchFirstMasterApplicationsPage();
    }
    async function fetchFirstMasterApplicationsPage() {
      const batchQuery = mastersBatch ? `batch=${mastersBatch}` : "";
      const statusQuery = selectedApplicationsStatus
        ? `&status=${selectedApplicationsStatus}`
        : "";
      setIsMasterInitialFetching(true);
      const fetchedData = (await fetch(
        `${process.env.NEXT_PUBLIC_LAMBDA_GET_MASTERS_APPLICATION}?${batchQuery}${statusQuery}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((d) => d.json())
        .finally(() => {
          setIsMasterInitialFetching(false);
        })) as TInfiniteMasterApplications;
      setMasterApplicationsData(fetchedData.data ?? []);
      setNextMasterApplicationsKey(fetchedData.nextStartKey);
      return fetchedData;
    }

    return () => {};
  }, [mastersBatch, selectedApplicationsStatus, token]);

  // NOTE: return all the values & functions you want to export
  return {
    batch,
    setBatch,
    selectedApplicationsStatus,
    setSelectedApplicationsStatus,
    isInitialFetching,
    applicationsData,
    setApplicationsData,
    nextApplicationsKey,
    setNextApplicationsKey,
    resetApplications,
    resetApplicationsFilter,
    isScholarshipsInitialFetching,
    scholarshipsData,
    setScholarshipsData,
    nextScholarshipsKey,
    setNextScholarshipsKey,
    resetScholarships,
    searchCpr,
    searchedCpr: cpr,
    updateMasterApplication,
    isMasterInitialFetching,
    setIsMasterInitialFetching,
    mastersBatch,
    setMastersBatch,
    masterApplicationsData,
    setMasterApplicationsData,
    nextMasterApplicationsKey,
    setNextMasterApplicationsKey,
    resetMasterApplications,
    searchMasterCpr,
    masterScholarshipsData,
    setMasterScholarshipsData,
    nextMasterScholarshipsKey,
    setNextMasterScholarshipsKey,
    resetMasterScholarships,
    isMasterScholarshipsInitialFetching,
  };
}
