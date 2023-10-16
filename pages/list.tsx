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
      console.log("List response: ", response);

      const lsResponse = localStorage.getItem(session?.user?.email || "");

      
        setList(response.data.userDetails);
      
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    console.log("LIST STATE VARIABLE: ", list);
  }, [list]);

  const editTask = (_id: string) => {};

  const deleteTask = async (_id: string) => {
    const session = await getSession();
    const response = await axios.delete(
      `/api/task?email=${session?.user?.email}&id=${_id.toString()}`
    );

    console.log(response.data);
  };

  return (
    <div className="flex gap-2">
      { list && list?.tasks?.map((listItem: any, index: number) => (
        <div className="p-3">
          <TaskCard
            key={index}
            name={listItem.name}
            date={listItem.date}
            time={listItem.time}
            id={listItem._id}
            description={listItem.description}
            onEditClick={() => editTask(listItem._id)}
            onDeleteClick={() => deleteTask(listItem._id)}
          />
        </div>
      ))}
    </div>
  );
}
