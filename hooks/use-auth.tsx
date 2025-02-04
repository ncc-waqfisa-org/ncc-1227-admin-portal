import {
  useState,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
  FC,
  useMemo,
} from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";
import config from "../src/aws-exports";
import { toast } from "react-hot-toast";
import { Admin, AdminRole } from "../src/API";
import { useRouter } from "next/router";
import { getAdminByCPR } from "../src/CustomAPI";
import { useQueryClient } from "@tanstack/react-query";

Auth.configure({ ...config, ssr: true });

interface IUseAuthContext {
  user: CognitoUser | undefined | null;
  cpr: string | undefined | null;
  token: string | undefined | null;
  admin: Admin | undefined;
  isSignedIn: boolean;
  isSuperAdmin: boolean;
  isInitializing: boolean;
  isChangePasswordRequired: boolean;
  signIn: (cpr: string, password: string) => Promise<CognitoUser | undefined>;
  signOut: () => Promise<void>;
  checkIfCprExist: (cpr: string) => Promise<boolean>;
}

const defaultState: IUseAuthContext = {
  user: null,
  cpr: null,
  token: null,
  admin: undefined,
  isSignedIn: false,
  isSuperAdmin: false,
  isInitializing: true,
  isChangePasswordRequired: false,
  signIn: async () => undefined,
  signOut: async () => {},
  checkIfCprExist: async () => false,
};

const AuthContext = createContext<IUseAuthContext>(defaultState);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Access auth values and functions with custom useAuth hook
export const useAuth = () => useContext(AuthContext);

function useProvideAuth() {
  const [user, setUser] = useState<CognitoUser | undefined | null>(
    defaultState.user
  );
  const [cpr, setCpr] = useState<string | undefined | null>(defaultState.cpr);
  // const [token, setToken] = useState<string | undefined | null>(
  //   defaultState.token
  // );
  const [admin, setAdmin] = useState<Admin | undefined>(defaultState.admin);
  const [isSignedIn, setIsSignedIn] = useState(defaultState.isSignedIn);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(
    defaultState.isSuperAdmin
  );
  const [isInitializing, setIsInitializing] = useState(
    defaultState.isInitializing
  );
  const [isChangePasswordRequired, setIsChangePasswordRequired] = useState(
    defaultState.isChangePasswordRequired
  );

  const { push } = useRouter();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);

  async function fetchToken() {
    try {
      const session = await Auth.currentSession();
      const latestToken = session.getAccessToken().getJwtToken();
      setToken(latestToken);
    } catch (error) {
      console.error("Error fetching token", error);
      setToken(null); // Handle expired or missing session
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchToken();

    // Refresh token every X minutes (e.g., 10 minutes)
    const interval = setInterval(fetchToken, 10 * 60 * 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const memoizedToken = useMemo(() => token, [token]);

  useEffect(() => {
    async function getAuthUser(): Promise<void> {
      try {
        const authUser: CognitoUser = await Auth.currentAuthenticatedUser();
        if (authUser) {
          await checkAuthUser(authUser).then(async (isAdmin) => {
            if (isAdmin) {
              setUser(authUser);
              // * Print user auth token
              // console.log(
              //   authUser.getSignInUserSession()?.getAccessToken().getJwtToken()
              // );
              // setToken(
              //   authUser
              //     .getSignInUserSession()
              //     ?.getAccessToken()
              //     .getJwtToken() ?? null
              // );

              await fetchToken();

              setCpr(
                authUser.getSignInUserSession()?.getAccessToken().payload
                  .username
              );
            }
          });
        }
        queryClient.invalidateQueries();
        setIsInitializing(false);
      } catch (error) {
        setIsSignedIn(false);
        setUser(null);
        setAdmin(undefined);
        setIsSuperAdmin(false);
        setIsInitializing(false);
        setToken(null);
        setCpr(null);
      }
    }

    // NOTE: check for user or risk an infinite loop
    if (!user) {
      // On component mount
      // If a user cookie exists
      // reset the user to it
      getAuthUser();
    }
  }, [queryClient, user]);

  /**
   * This function checks if a CPR number exists for an admin and returns a boolean value.
   * @param {string} cpr - cpr is a string parameter that represents a CPR number, which is a unique
   * identification number assigned to individuals in Denmark. The function is checking if this CPR
   * number already exists in the system by calling the getAdminByCPR function and returning a boolean
   * value indicating whether or not the CPR number exists.
   * @returns a Promise that resolves to a boolean value. The boolean value indicates whether or not an
   * admin with the given CPR exists.
   */
  async function checkIfCprExist(cpr: string): Promise<boolean> {
    const tempAdmin = await getAdminByCPR(cpr);
    return tempAdmin?.cpr !== undefined;
  }

  /**
   * This function checks if a user is authenticated and sets their admin status accordingly.
   * @param {CognitoUser} user - The parameter `user` is of type `CognitoUser`, which is likely an object
   * representing a user in an Amazon Cognito user pool.
   * @returns a Promise that resolves to a boolean value indicating whether the user is authenticated or
   * not.
   */
  async function checkAuthUser(user: CognitoUser): Promise<boolean> {
    let tempAdmin = await getAdminByCPR(user.getUsername());
    if (tempAdmin === undefined) {
      Auth.signOut();
      setIsSignedIn(false);
      setUser(null);
      setToken(null);
      setCpr(null);
      setAdmin(undefined);
      setIsSuperAdmin(false);
    } else {
      setAdmin(tempAdmin);
      setIsSuperAdmin(tempAdmin.role === AdminRole.SUPER_ADMIN);
      setIsSignedIn(true);
      setToken(
        user.getSignInUserSession()?.getAccessToken().getJwtToken() ?? null
      );
      setCpr(user.getSignInUserSession()?.getAccessToken().payload.cpr);
    }
    return tempAdmin !== undefined;
  }

  /**
   * It checks if the user is signed in, and if so, it sets the user state to the user object returned by
   * the Auth.currentAuthenticatedUser() method
   */
  async function getAuthUser(): Promise<void> {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      if (authUser) {
        await checkAuthUser(authUser).then((isAdmin) => {
          if (isAdmin) {
            setUser(authUser);
          }
        });
      }
      setIsInitializing(false);
    } catch (error) {
      setIsSignedIn(false);
      setUser(null);
      setAdmin(undefined);
      setIsSuperAdmin(false);
      setIsInitializing(false);
    }
  }

  /**
   * It signs in a user with the given credentials.
   * @param {string} cpr - string, password: string
   * @param {string} password - string - The password of the user
   */
  const signIn = (
    cpr: string,
    password: string
  ): Promise<CognitoUser | undefined> =>
    toast.promise(
      checkIfCprExist(cpr).then(async (cprExist) => {
        if (cprExist) {
          const cognitoUser = await Auth.signIn(cpr, password)
            .then(async (res) => {
              await getAuthUser();
              return res;
            })
            .catch((error) => {
              throw error;
            });

          setIsSignedIn(true);
          setUser(cognitoUser);
          if (cognitoUser !== undefined) {
            if (cognitoUser.challengeName === "NEW_PASSWORD_REQUIRED") {
              push("../changePassword");
            }
          }
          return cognitoUser;
        } else {
          throw new Error("CPR does not exist");
        }
      }),
      {
        loading: "Signing in...",
        success: (authUser) => {
          push("/");
          return `${authUser?.getUsername()} Successfully signed in`;
        },
        error: (error) => {
          return `${error?.message}`;
        },
      }
    );

  /**
   * It signs out the user.
   */
  const signOut = (): Promise<void> =>
    toast.promise(
      Auth.signOut().then(() => {
        setIsSignedIn(false);
        setUser(null);
        setAdmin(undefined);
        setIsSuperAdmin(false);
      }),
      {
        loading: "Signing Out...",
        success: () => {
          queryClient.invalidateQueries();
          push("/");
          return "Signed out";
        },
        error: (error) => {
          return `${error?.message}`;
        },
      }
    );

  return {
    user,
    token: memoizedToken,
    cpr,
    admin,
    isSignedIn,
    isSuperAdmin,
    signIn,
    signOut,
    checkIfCprExist,
    isChangePasswordRequired,
    isInitializing,
  };
}

// export async function getAdminUser(params: type) {}
