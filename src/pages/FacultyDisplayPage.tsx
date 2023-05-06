import { NextPage } from 'next';
import { useContext } from 'react';
import { UserContext } from './_app';

const FacultyDisplayPage: NextPage = () => {
  const user = useContext(UserContext);

  return (
  
    <div>
      <h1>Welcome to the Faculty Display Page!</h1>
      <p>Your role is: {user?.role}</p>
    </div>
  );
};


export default FacultyDisplayPage;