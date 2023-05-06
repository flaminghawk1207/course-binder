import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";
import { UserProvider } from "~/contexts/UserProvider";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (    
    <UserProvider>
      <Component {...pageProps}/>
    </UserProvider>
  )
};

export default MyApp;
