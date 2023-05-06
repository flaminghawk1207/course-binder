import { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from './_app';
import { apiReq } from "~/utils";
import NavBar from "~/Components/NavBar";
import CreateCourseView from "~/Components/CreateCourseView";
import { useRouter } from 'next/router';
import login from './api/login';

const FacultyDisplayPage: NextPage = () => {
  const user = useContext(UserContext);
  const [resObject, setResObject] = useState<any>();
  const router = useRouter(); 

  useEffect(()=>{
    if (!user){
      router.push('login');
      return;  
    }

    (async()=>{
      let { facultyCourseObject } = await apiReq('facultyCourseDetails', user?.email);
      facultyCourseObject.map ((elem:any) => elem.ChannelComponent = CreateCourseView (elem.channel_name, elem.channel_code, elem.channel_department))
      setResObject( { facultyCourses : facultyCourseObject });
      console.log({facultyCourseObject});
    })()
  },[])

  return (
    <div>
    {/* <h1>Welcome to the Faculty Display Page!</h1>
    <p>Your role is: {user?.role}</p>  */}
    {/* {resObject?.facultyCourses.map((elem : any) => <h1>{elem.channel_name}</h1>)} */}
    {/* <NavBar items = [] /> */}
    <NavBar items = {resObject?.facultyCourses} />

    </div>
  );
};


export default FacultyDisplayPage;