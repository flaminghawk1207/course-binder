import { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '~/contexts/UserProvider';
import { apiReq } from "~/utils";
import NavBar from "~/Components/NavBar";
import { useRouter } from 'next/router';
import { Channel, NavItem } from '~/types';
import CourseView from '~/Components/CourseView';
import { Forbidden } from '~/Components/forbidden';

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
        const facultyNavItems = facultyChannels.map((channel: Channel) => {
            return {
                "label": channel.channel_code,
                "component": <CourseView key={channel.channel_code} channel={channel}/>,
            } as NavItem
        })
        setChannels(facultyChannels);
        setResObject(facultyNavItems);
    }

    const getChannelTypeFromLabel = (navItem: NavItem) => {
        let channel_type = channels?.find((channel: Channel) => channel.channel_code == navItem.label)?.channel_type;
        return channel_type;
    }

    if (!resObject) return <>Loading...</>;

    return (
        <div>
            <NavBar items={resObject} items_differentiator={getChannelTypeFromLabel} />
        </div>
    );
};


export default FacultyDisplayPage;