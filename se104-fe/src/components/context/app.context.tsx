import { authenticateAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

type IAppContext = {
  user: IFetchUser | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (v: IFetchUser) => void;
};

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

export const AppProvider = (props: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IFetchUser | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await authenticateAPI(token);
      if (res) {
        setIsAuthenticated(true);
        setUser(res);
      }
      console.log("hee");
    };
    fetchUser();
  }, []);
  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser,
      }}
    >
      {props.children}
    </CurrentAppContext.Provider>
  );
};
export const useCurrentApp = () => {
  const currentAppContext = useContext(CurrentAppContext);

  if (!currentAppContext) {
    throw new Error(
      "useCurrentApp has to be used within <CurrentAppContext.Provider>"
    );
  }

  return currentAppContext;
};
