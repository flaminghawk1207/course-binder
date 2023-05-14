import { UserContext } from "~/contexts/UserProvider";
import { Button } from "@mui/material";
import { useContext } from "react";

export const LogOut = () => {
    const user = useContext(UserContext);
    console.log(user);

    return (
        <div className="mb-10">
            <Button id="userLogOutButton" 
                onClick={() => user.logout()} 
                variant="outlined" 
                sx={{mt:2}} 
                className="w-full" 
            >
                Log Out
            </Button>
        </div>
    );
}