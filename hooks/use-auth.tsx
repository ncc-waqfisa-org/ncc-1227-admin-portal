import {
  useState,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
  FC,
} from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";
import config from "../src/aws-exports";
import { toast } from "react-hot-toast";
import { API } from "aws-amplify";
import { Admin, GetAdminQuery, GetAdminQueryVariables } from "../src/API";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { useRouter } from "next/router";
import { getAdmin } from "../src/graphql/queries";

Auth.configure({ ...config, ssr: true });

interface IUseAuthContext {
  user: CognitoUser | undefined;
  admin: Admin | undefined;
  isSignedIn: boolean;
  isInitializing: boolean;
  isChangePasswordRequired: boolean;
  signIn: (cpr: string, password: string) => Promise<CognitoUser | undefined>;
  signOut: () => Promise<void>;
  checkIfCprExist: (cpr: string) => Promise<boolean>;
}

const defaultState: IUseAuthContext = {
  user: undefined,
  admin: undefined,
  isSignedIn: false,
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
  const [user, setUser] = useState<CognitoUser | undefined>(defaultState.user);
  const [admin, setAdmin] = useState<Admin | undefined>(defaultState.admin);
  const [isSignedIn, setIsSignedIn] = useState(defaultState.isSignedIn);
  const [isInitializing, setIsInitializing] = useState(
    defaultState.isInitializing
  );
  const [isChangePasswordRequired, setIsChangePasswordRequired] = useState(
    defaultState.isChangePasswordRequired
  );

  const { push } = useRouter();

  useEffect(() => {
    // NOTE: check for user or risk an infinite loop
    if (!user) {
      // On component mount
      // If a user cookie exists
      // reset the user to it
      getAuthUser();
    }
  }, [user]);

  /**
   * This function checks if a given CPR number exists in a GraphQL query and returns a boolean value.
   * @param {string} cpr - The `cpr` parameter is a string representing a CPR number, which is a unique
   * identification number assigned to individuals. The function `checkIfCprExist` takes this
   * parameter and checks if there is an existing record in the database with the same CPR number.
   * @returns The function `checkIfCprExist` returns a Promise that resolves to a boolean value. The
   * boolean value indicates whether or not a record with the given CPR number exists in the database.
   */
  async function checkIfCprExist(cpr: string): Promise<boolean> {
    let queryInput: GetAdminQueryVariables = {
      cpr: cpr,
    };

    let res = (await API.graphql({
      query: getAdmin,
      variables: queryInput,
    })) as GraphQLResult<GetAdminQuery>;
    setAdmin(res.data ? (res.data.getAdmin as Admin) : undefined);

    return res.data?.getAdmin != null;
  }

  async function checkAuthUser(user: CognitoUser): Promise<boolean> {
    let isAdmin = await checkIfCprExist(user.getUsername());
    if (!isAdmin) {
      Auth.signOut();
      setIsSignedIn(false);
      setUser(undefined);
    }
    return isAdmin;
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
            setIsSignedIn(true);
            setUser(authUser);
          }
        });
      }
      setIsInitializing(false);
    } catch (error) {
      setIsSignedIn(false);
      setUser(undefined);
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
          const cognitoUser = await Auth.signIn(cpr, password).catch(
            (error) => {
              throw error;
            }
          );

          setIsSignedIn(true);
          setUser(cognitoUser);
          if (cognitoUser !== undefined) {
            if (cognitoUser.challengeName === "NEW_PASSWORD_REQUIRED") {
              push("../changePassword");
            }
          }

          // ! TODO - stop user from being able to go to different pages when they haven't changed temp password

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
        setUser(undefined);
      }),
      {
        loading: "Signing Out...",
        success: () => {
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
    admin,
    isSignedIn,
    signIn,
    signOut,
    checkIfCprExist,
    isChangePasswordRequired,
    isInitializing,
  };
}

// export async function getAdminUser(params: type) {}
