import { UserContext } from "~/contexts/UserProvider";
import { Button } from "@mui/material";
import { useContext } from "react";

export default () => {
    const user = useContext(UserContext);
    console.log(user);

    return (
        <Button id="userLogOutButton" 
            onClick={() => user.logout()} 
            variant="outlined" 
            sx={{mt:2}} 
            className="w-full" 
        >
            Log Out
        </Button>
    );
}