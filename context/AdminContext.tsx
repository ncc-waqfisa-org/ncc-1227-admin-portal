import AWS from "aws-sdk";

import { createContext, FC, PropsWithChildren, useContext } from "react";

// interface for all the values & functions
interface IUseAdminContext {}

// the default state for all the values & functions
const defaultState: IUseAdminContext = {};

// creating the app contexts
const AdminContext = createContext<IUseAdminContext>(defaultState);

// Access app values and functions with custom useAppContext hook
export const useAdminContext = () => useContext(AdminContext);

// The App provider to wrap the components that will use the context
export const AdminProvider: FC<PropsWithChildren> = ({ children }) => {
  const app = useAdminProviderApp();
  return <AdminContext.Provider value={app}>{children}</AdminContext.Provider>;
};

//NOTE: declare vars and functions here
function useAdminProviderApp() {
  // NOTE: return all the values & functions you want to export
  return {};
}
