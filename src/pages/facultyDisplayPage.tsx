import { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '~/contexts/UserProvider';
import { apiReq } from "~/utils";
import NavBar from "~/Components/NavBar";
import { useRouter } from 'next/router';
import { Channel, NavItem } from '~/types';
import CourseView from '~/Components/CourseView';

const FacultyDisplayPage: NextPage = () => {
    const { user } = useContext(UserContext);
    const [resObject, setResObject] = useState<NavItem[]>();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('login');
            return;
        }

        (async () => {
            await refreshChannels();
        })()
    }, [])

    const refreshChannels = async () => {
        let { facultyChannels } = await apiReq('facultyCourseDetails', user?.email)
        facultyChannels = facultyChannels as Channel[];
        facultyChannels = facultyChannels.map((channel: Channel) => {
            return {
                "label": channel.channel_code,
                "component": <CourseView channel={channel}/>,
            } as NavItem
        })
        setResObject(facultyChannels);
    }

    if (!resObject) return <>Loading...</>;

    return (
        <div>
            <NavBar items={resObject} />
        </div>
    );
};


export default FacultyDisplayPage;