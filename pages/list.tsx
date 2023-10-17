import TaskCard, { EditForm } from "@/components/TaskCard";
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [list, setList] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>();
  let globalSession: any;


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchDetails = async () => {
      const session = await getSession();
      globalSession = session;
      const response = await axios.get(
        `/api/task?email=${session?.user?.email}`
      );

      const backendData = response?.data?.userDetails?.tasks;
      console.log("List response: ", backendData);

      const LSGET = localStorage.getItem(session?.user?.email || "");
      const lsResponse = JSON.parse(LSGET!);
      console.log("Response from LS: ", lsResponse);
      setList({ tasks: lsResponse });
    };

    const interval = setInterval(() => {
      fetchDetails();
    },500)

    return () => clearInterval(interval);

  }, []);

  const editTask = (_id: string) => {
    console.log("edit requested");
    const taskToEdit = list?.tasks.find((task) => task._id === _id);
    if (taskToEdit) {
      setEditTaskData(taskToEdit);
      setEditMode(true);
    } else {
      setEditTaskData(null);
    }
  };

  const deleteTask = async (_id: string) => {
    console.log("ID: ", _id);
    if(!_id){
      return;
    }
    const session = await getSession();
    try {
      const response = await axios.delete(
        `/api/task?email=${session?.user?.email}&id=${_id!}`
      );
  
      console.log(response.data);
  
      if (response.data.status === 201) {
        const userTaskKey = session?.user?.email || "";
        const lsData = JSON.parse(localStorage.getItem(userTaskKey) || "[]");
        const updatedData = lsData.filter((task: Task) => task._id !== _id);
  
        localStorage.setItem(userTaskKey, JSON.stringify(updatedData));
  
        const LSGET = localStorage.getItem(userTaskKey);
        console.log("LS AFTER : ", JSON.parse(LSGET!));
  
        // Update the state with the updated data
        setList({ tasks: updatedData });
      } else {
        console.log("DELETION NOT DONE FROM LS");
      }
    } catch (error:any){
      console.log(error.message);
    }
  };

  useEffect(() => {
    console.log("List edit detected, reloading");
  }, [list]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {editMode && editTaskData ? (
        <EditForm
          name={editTaskData.name}
          date={editTaskData.date}
          time={editTaskData.time}
          description={editTaskData.description}
          id={editTaskData._id}
          editMode={() => setEditMode(false)}
          editData={() => setEditTaskData(null)}
        />
      ) : null}

      {list &&
        list?.tasks?.map((listItem: any, index: number) => (
          <div className="p-3" key={index}>
            <TaskCard
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
