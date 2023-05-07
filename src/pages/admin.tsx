import { type NextPage } from "next";
import AdminManageChannel from "~/Components/adminManageChannel";
import { ChannelType, NavItem } from "~/types";
const AdminView: NextPage = () => {

    const tabs: NavItem[] = [
        {
            label: "Manage Channels",
            component: <AdminManageChannel/>,
        },
        {
            label: "Manage Users",
            component: <></>,
        },
        {
            label: "View Analytics",
            component: <></>,
        }
    ]

    return <></>
}

export default AdminView;