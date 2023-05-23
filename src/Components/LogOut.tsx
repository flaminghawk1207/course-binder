import { UserContext } from "~/contexts/UserProvider";
import { Button } from "@mui/material";
import { useContext } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";

export const LogOut = () => {
    const user = useContext(UserContext);
    const router = useRouter();

    return (
        <div className="my-10 ml-5 bg-primary-color hover:bg-hovercolor rounded w-4/5 justify-center">
            <Button id="userLogOutButton" 
                endIcon={<LogoutIcon/>}
                variant="contained"
                size="large"
                onClick={() => {
                    user.logout();
                    router.push('/login');
                 }} 
                className="w-full text-primary-txt" 
            >
                Log Out
            </Button>
        </div>
    );
}