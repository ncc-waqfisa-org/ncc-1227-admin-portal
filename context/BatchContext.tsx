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
import { Status } from "../src/API";
import {
  InfiniteApplication,
  TInfiniteApplications,
  NextStartKey,
} from "../components/ui/applications/infinite-applications-type";
import { InfiniteData } from "@tanstack/react-query";
import { useAuth } from "../hooks/use-auth";

// interface for all the values & functions
interface IUseBatchContext {
  applicationsData: InfiniteApplication[];
  setApplicationsData: Dispatch<SetStateAction<InfiniteApplication[]>>;

  nextApplicationsKey: NextStartKey | undefined;
  setNextApplicationsKey: Dispatch<SetStateAction<NextStartKey | undefined>>;

  isInitialFetching: boolean;
  batch: number;
  setBatch: Dispatch<SetStateAction<number>>;
  selectedApplicationsStatus: string | undefined;
  setSelectedApplicationsStatus: Dispatch<SetStateAction<string | undefined>>;
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
  const [batch, setBatch] = useState<number>(defaultState.batch);
  const [nextApplicationsKey, setNextApplicationsKey] = useState<
    NextStartKey | undefined
  >();
  const [selectedApplicationsStatus, setSelectedApplicationsStatus] = useState<
    string | undefined
  >(defaultState.selectedApplicationsStatus);

  const [applicationsData, setApplicationsData] = useState(
    defaultState.applicationsData
  );

  useEffect(() => {
    setNextApplicationsKey(undefined);
    setApplicationsData([]);

    return () => {};
  }, [batch, selectedApplicationsStatus]);

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
        `${process.env.NEXT_PUBLIC_APPLICATION_PAGINATION_ENDPOINT}?${batchQuery}${statusQuery}`,
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

      setApplicationsData((old) => [...old, ...fetchedData.data]);
      setNextApplicationsKey(fetchedData.nextStartKey);
      return fetchedData;
    }

    return () => {};
  }, [batch, selectedApplicationsStatus, token]);

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
  };
}
