import { UserContext } from "~/contexts/UserProvider";
import { Button } from "@mui/material";
import { useContext } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";

export const LogOut = () => {
    const user = useContext(UserContext);
    const router = useRouter();

    return (
        <div className="mb-10 bg-[#EDC3AB]">
            <Button id="userLogOutButton" endIcon={<LogoutIcon/>}
                onClick={() => {
                    user.logout();
                    router.push('/login');
                 }} 
                sx={{mt:1}} 
                className="w-full text-[#0c0a09]" 
            >
                Log Out
            </Button>
        </div>
    );
}