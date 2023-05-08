import { type NextPage } from "next";
import NavBar from "~/Components/NavBar";
import AdminManageChannel from "~/Components/adminManageChannel";
import AdminManageUser from "~/Components/adminManageUser";
import { NavItem } from "~/types";
const AdminView: NextPage = () => {

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