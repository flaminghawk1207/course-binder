import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";
import { createContext, useState } from "react";
import { User } from "~/types/User";

export const UserContext = createContext<User | null>(null);

const MyApp: AppType = ({ Component, pageProps }) => {
  const [user, setUser] = useState<User | null>(null);
  return (    
    <UserContext.Provider value={user}>
      <Component {...pageProps} setUser={setUser}/>
    </UserContext.Provider>
  )
};

export default MyApp;
