import { useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import { UserContext } from "~/contexts/UserProvider";
import { type NextPage } from "next";
import NavBar from "~/Components/NavBar";
import AdminManageChannel from "~/Components/adminManageChannel";
import AdminManageUser from "~/Components/adminManageUser";
import AnalyticsView from "~/Components/analyticsView"
import { Forbidden } from "~/Components/forbidden";
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
            component: <AnalyticsView/>,
        }
    ]

    return <>
        <NavBar items={navItems}/>
    </>
}

export default AdminView;