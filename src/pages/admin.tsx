import { useContext, useEffect } from "react";
import { useRouter } from 'next/router';
import { UserContext } from "~/contexts/UserProvider";
import { type NextPage } from "next";
import { useContext } from "react";
import NavBar from "~/Components/NavBar";
import AdminManageChannel from "~/Components/adminManageChannel";
import AdminManageUser from "~/Components/adminManageUser";
<<<<<<< HEAD
import { NavItem } from "~/types";

const AdminView: NextPage = () => {
    const { user } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        if (!user || user==null || user==undefined) {
            router.push('login');
            return;
        }
    }, [user])
=======
import AnalyticsView from "~/Components/analyticsView"
import { Forbidden } from "~/Components/forbidden";
import { UserContext } from "~/contexts/UserProvider";
import { NavItem, ROLE } from "~/types";
const AdminView: NextPage = () => {
    const {user} = useContext(UserContext);
    if (!user || user.role !== ROLE.ADMIN) {
        return <Forbidden/>
    }
>>>>>>> ba520f33f279fc5dc3e51971f5ad90fd343e0b39

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