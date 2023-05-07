import { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '~/contexts/UserProvider';
import { apiReq } from "~/utils";
import NavBar from "~/Components/NavBar";
import CreateCourseView from "~/Components/CreateCourseView";
import { useRouter } from 'next/router';
import { Channel, NavItem } from '~/types';

const FacultyDisplayPage: NextPage = () => {
  const { user } = useContext(UserContext);
  const [resObject, setResObject] = useState<NavItem[]>();
  const router = useRouter(); 

  useEffect(()=>{
    if (!user){
      router.push('login');
      return;  
    }

    (async()=>{
      let { facultyCourseObject: facultyCourses } = await apiReq('facultyCourseDetails', user?.email)
      facultyCourses = facultyCourses as Channel[];
        
      facultyCourses = facultyCourses.map((elem: Channel) => {
        return {
          "label": elem.channel_code,
          "component": CreateCourseView (elem.channel_name, elem.channel_code, elem.channel_department)
        } as NavItem
      })
      setResObject( facultyCourses );
      console.log(facultyCourses);
    })()
  },[])

  if(!resObject) return <>Loading...</>;

  return (
    <div>
      <NavBar items = {resObject} />
    </div>
  );
};


export default FacultyDisplayPage;