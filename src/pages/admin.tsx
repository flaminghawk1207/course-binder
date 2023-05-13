import { type NextPage } from "next";
import { useContext } from "react";
import NavBar from "~/Components/NavBar";
import AdminManageChannel from "~/Components/adminManageChannel";
import AdminManageUser from "~/Components/adminManageUser";
import { Forbidden } from "~/Components/forbidden";
import { UserContext } from "~/contexts/UserProvider";
import { NavItem, ROLE } from "~/types";
const AdminView: NextPage = () => {
    const {user} = useContext(UserContext);
    if (!user || user.role !== ROLE.ADMIN) {
        return <Forbidden/>
    }

    const navItems: NavItem[] = [
        {
            label: "Manage Channels",
            component: <AdminManageChannel/>,
        },
        {
            label: "Manage Users",
            component: <AdminManageUser/>,
        },
        {
            label: "View Analytics",
            component: <></>,
        }
    ]

    return <>
        <NavBar items={navItems}/>
    </>
}

export default AdminView;