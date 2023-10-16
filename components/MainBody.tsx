"use client";
import React, { useState , useEffect} from "react";
import {useSession} from "next-auth/react";
import { Alert } from "@mui/material";
import axios from "axios";
const Main = () => {

  const {data: session} = useSession();
  const [todo, setTodo] = useState({
    name:"",
    date:"",
    time:"",
    description:"",
  });

  const[confirmAddition , setConfirmAddition] = useState(false);

    
  const addTodo = async() => {
    console.log("DATA: ",todo);
    const response = await axios.post("/api/task",{
      email: session?.user?.email,
      task: todo,
    })
    console.log(response);
    
    if(response.status !== 500)
    {
      const newTaskID = response.data.id;
      const existingTasks = JSON.parse(localStorage.getItem(session?.user?.email || "") || '[]');
      existingTasks.push({
        ...todo,
        id: newTaskID,
      });
      localStorage.setItem(session?.user?.email || "" , JSON.stringify(existingTasks));
      // setTodo({
      //   name: "",
      //   date: "",
      //   time: "",
      //   description: "",
      // })

      setConfirmAddition(true);
    }
  };

  const onChange = (e:any) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };
  
    useEffect(() => {
        let timer:any;
        if(confirmAddition)
        {
            timer = setTimeout(() => {
                setConfirmAddition(false);
            },5000);
        }

        return () => {
            clearTimeout(timer);
        }
    },[confirmAddition]);

  return (
    <>
      {
        confirmAddition && (<Alert severity="success" onClose={() => {
            setConfirmAddition(false)
        }} >Task Added Successfully</Alert>)
      }

      <section className="text-gray-700 body-font relative">
        <div className="container px-5 py-24 mx-auto my-5">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Create a Task
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Mention relevant details about the task
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="text" className="leading-7 text-sm text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={todo.name}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label htmlFor="date" className="leading-7 text-sm text-gray-600">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    value={todo.date}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="p-2 w-full">
              <label htmlFor="time" className="leading-7 text-sm text-gray-600">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    value={todo.time}
                    onChange={onChange}
                  />
                <div className="relative">
                  <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                    Message
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    value={todo.description}
                    onChange={onChange}
                  ></textarea>
                </div>
              </div>
              <div className="p-5 w-full">
                <button
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  onClick={addTodo}
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Main;
