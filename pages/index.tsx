import {useEffect} from 'react';
import MainBody from '@/components/MainBody';
import {getSession} from "next-auth/react";
import axios from 'axios';

export default function Home() {

  useEffect(()=>{
    const fetchDetails = async() => {
      const session = await getSession();
      if(!session){
        return;
      }
      const response = await axios.get(`/api/task?email=${session?.user?.email}`);
      console.log(response);
      const ls = response.data.userDetails.tasks;
      localStorage.setItem(session?.user?.email || "" , JSON.stringify(ls));
    }
    fetchDetails();
  },[])

  return (
    <>
    
    <MainBody/>
    </>
  )
}
