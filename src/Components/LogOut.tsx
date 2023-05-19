import { UserContext } from "~/contexts/UserProvider";
import { Button } from "@mui/material";
import { useContext } from "react";
import { useRouter } from "next/router";

export const LogOut = () => {
    const user = useContext(UserContext);
    const router = useRouter();
    console.log(user);

    return (
        <div className="mb-10">
            <Button id="userLogOutButton" 
                onClick={() => {
                    user.logout();
                    router.push('/login');
                }} 
                variant="outlined" 
                sx={{mt:2}} 
                className="w-full" 
            >
                Log Out
            </Button>
        </div>
    );
}