import TaskCard from "@/components/TaskCard";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";

interface Task {
  name: string;
  date: string;
  time: string;
  description: string;
  _id: string;
}

interface User {
  tasks: Task[];
}

export default function List() {
  const [list, setList] = useState<User|null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const session = await getSession();
      const response = await axios.get(
        `/api/task?email=${session?.user?.email}`
      );

      const backendData = response?.data?.userDetails?.tasks;
      console.log("List response: ", backendData);
    
      const LSGET = localStorage.getItem(session?.user?.email || "")
      const lsResponse = JSON.parse(LSGET!);

      console.log("Response from LS: ",lsResponse);
      
      setList({tasks: lsResponse});
      
    };
    fetchDetails();
  }, []);


  const editTask = (_id: string) => {};

  const deleteTask = async (_id: string) => {
    console.log("ID: ",_id);
    const session = await getSession();
    const response = await axios.delete(
      `/api/task?email=${session?.user?.email}&id=${_id.toString()}`
    );

    console.log(response);
    
    if(response.status === 200){
      
    const userTaskKey = session?.user?.email || "";
    const lsData = JSON.parse(localStorage.getItem(userTaskKey) || '[]');
    const updatedData = lsData.filter((task:Task) => task._id !== _id);

    localStorage.setItem(userTaskKey,JSON.stringify(updatedData));

    setList({tasks: updatedData});

    const LSGET = localStorage.getItem(userTaskKey);
    console.log("LS AFTER : ",JSON.parse(LSGET!));

    }

    else{
      console.log("DELETION NOT DONE FROM LS");
    }

  };

  useEffect(()=>{
    console.log("List edit detected , reloading");
  },[list])

  return (
    <div className="grid gap-2">
      { list && list?.tasks?.map((listItem: any, index: number) => (
        <div className="p-3">
          <TaskCard
            key={index}
            name={listItem.name}
            date={listItem.date}
            time={listItem.time}
            description={listItem.description}
            onEditClick={() => editTask(listItem._id)}
            onDeleteClick={() => deleteTask(listItem._id)}
          />
        </div>
      ))}
    </div>
  );
}
