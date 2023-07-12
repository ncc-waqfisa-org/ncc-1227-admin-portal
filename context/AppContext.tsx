import { GraphQLResult } from "@aws-amplify/api-graphql";
import { API } from "aws-amplify";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Admin, ListAdminsQuery, ListAdminsQueryVariables } from "../src/API";
import { listAdmins } from "../src/graphql/queries";
import { compareAdmins } from "../src/Helpers";
import { useAuth } from "../hooks/use-auth";

// interface for all the values & functions
interface IUseAppContext {
  admins: Admin[];
  syncAdmins: () => Promise<void>;
}

// the default state for all the values & functions
const defaultState: IUseAppContext = {
  admins: [],
  syncAdmins: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
};

// creating the app contexts
const AppContext = createContext<IUseAppContext>(defaultState);

// Access app values and functions with custom useAppContext hook
export const useAppContext = () => useContext(AppContext);

// The App provider to wrap the components that will use the context
export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const app = useProviderApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

//NOTE: declare vars and functions here
function useProviderApp() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const { isSignedIn } = useAuth();
  useEffect(() => {
    if (isSignedIn) {
      getAdmins();
    }
    return () => {};
  }, [isSignedIn]);

  async function getAdmins() {
    let queryInput: ListAdminsQueryVariables = {
      limit: 999999,
    };

    let res = (await API.graphql({
      query: listAdmins,
      variables: queryInput,
    })) as GraphQLResult<ListAdminsQuery>;

    const tempAdmins = (res.data?.listAdmins?.items ?? []) as Admin[];
    tempAdmins.sort(compareAdmins);
    setAdmins(tempAdmins);
    return tempAdmins;
  }

  async function syncAdmins() {
    await getAdmins();
  }

  // NOTE: return all the values & functions you want to export
  return { admins, syncAdmins };
}
