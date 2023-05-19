import { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '~/contexts/UserProvider';
import { apiReq } from "~/utils";
import NavBar from "~/Components/NavBar";
import { useRouter } from 'next/router';
import { Channel, NavItem, ROLE } from '~/types';
import CourseView from '~/Components/CourseView';
import { Forbidden } from '~/Components/forbidden';
import AnalyticsView from '~/Components/analyticsView';

const FacultyDisplayPage: NextPage = () => {
    const { user } = useContext(UserContext);
    const [resObject, setResObject] = useState<NavItem[]>();
    const [channels, setChannels] = useState<Channel[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!user || user==null || user==undefined) {
            router.push('login');
            return;
        }

        (async () => {
            await refreshChannels();
        })()
    }, [user])

    if(!user) return <Forbidden/>;

    const refreshChannels = async () => {
        let { facultyChannels } = await apiReq('facultyCourseDetails', user?.email)
        facultyChannels = facultyChannels as Channel[];
        let facultyNavItems = [];
        
        if(user.role == ROLE.PRINCIPAL) {
            facultyNavItems.push({
                "label": "View Analytics",
                "component": <AnalyticsView level={"COLLEGE"} maxDepth={3}/>,
            } as NavItem)
        } else if(user.role == ROLE.HOD) {
            facultyNavItems.push({
                "label": "View Analytics",
                "component": <AnalyticsView level={"DEPARTMENT"} maxDepth={2} dept={user.department}/>,
            } as NavItem)
        }

        facultyNavItems = facultyNavItems.concat(facultyChannels.map((channel: Channel) => {
            return {
                "label": channel.channel_code,
                "component": <CourseView key={channel.channel_code} channel={channel}/>,
            } as NavItem
        }))
        
        setChannels(facultyChannels);
        setResObject(facultyNavItems);
    }

    const getChannelTypeFromLabel = (navItem: NavItem) => {
        let channel_req = channels?.find((channel: Channel) => channel.channel_code == navItem.label);
        if(channel_req == undefined) return "Analytics";
        return channel_req.channel_type;
    }

    if (!resObject) return <>Loading...</>;

    return (
        <div>
            <NavBar items={resObject} items_differentiator={getChannelTypeFromLabel} />
        </div>
    );
};


export default FacultyDisplayPage;