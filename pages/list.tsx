import TaskCard,{EditForm} from "@/components/TaskCard";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
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
  const [editMode,setEditMode] = useState(false);
  const [editTaskData,setEditTaskData] = useState<Task|null>();
  let globalSession:any;
  useEffect(() => {
    const fetchDetails = async () => {
      const session = await getSession();
      globalSession = session;
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


  const editTask = (_id: string) => {
      const taskToEdit = list?.tasks.find((task) => task._id === _id);
      if(taskToEdit){
        setEditTaskData(taskToEdit);
        setEditMode(true);
      }
  };

  const closeEditForm = () => {
    setEditTaskData(null);
    setEditMode(false);
  }

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
      {
        editMode && editTaskData ? (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg inline-flex flex-col">
            
            <button
              onClick={() => {
                setEditTaskData(null);
                setEditMode(false);
              }}
              className="text-gray-600 bg-red-800 text-white p-2 rounded-lg"
            >
              Close
            </button>
            <EditForm
              name={editTaskData.name}
              date={editTaskData.date}
              time={editTaskData.time}
              description={editTaskData.description}
              id={editTaskData._id}
            />
          </div>
        </div>
      ) : null
      
      }

      { 
        list && list?.tasks?.map((listItem: any, index: number) => (
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
