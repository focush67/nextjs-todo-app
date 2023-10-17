import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CloseButton from "./CloseButton";
export const TaskCard = ({
  name,
  date,
  time,
  description,
  onEditClick,
  onDeleteClick,

}: {
  name: string;
  date: string;
  time: string;
  description: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
  
}) => {
  return (
    <div className="task-card bg-gray-100 rounded-lg p-4 shadow-lg">
      <h2 className="text-xl font-bold">{name}</h2>
      <div className="flex justify-between mt-2">
        <p className="text-sm text-gray-600">{date}</p>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
      {description && (
        <>
          <p className="text-md text-gray-600 mt-2 italic">{description}</p>
        </>
      )}
      <div className="flex justify-end mt-2 space-x-3">
        <button
          onClick={onEditClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Edit
        </button>
        <button
          onClick={onDeleteClick}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

export const EditForm = ({
  name,
  date,
  time,
  description,
  id,
  editMode,
  editData,
}: {
  name: string;
  date: string;
  time: string;
  description: string;
  id: string;
  editMode: any;
  editData: any;
}) => {
  const [formData, setFormData] = useState({
    name,
    date,
    time,
    description,
  });

  const [overlayVisible, setOverlayVisible] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const session = await getSession();
    try {
      const response = await axios.put(
        `/api/task?email=${session?.user?.email}&id=${id}`,
        {
          task: formData,
        }
      );

      console.log(response.data);

      const userKey = session?.user?.email;
      const lsData = JSON.parse(localStorage.getItem(userKey || "[]") || "");
      const updatedData = lsData?.map((task: any) => {
        if (task._id === id) {
          return {
            ...task,
            ...formData,
          };
        }
        return task;
      });

      localStorage.setItem(userKey!, JSON.stringify(updatedData));

      setFormSubmitted(true);

      setOverlayVisible(false);

      editData(null);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      {overlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-200 p-4 rounded-lg shadow-lg inline-flex flex-col">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <div className="m-4 text-center">
                <label
                  className="block text-gray-600 text-sm font-semibold"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="w-full px-3 py-2 m-1 border rounded-md shadow-sm focus:ring focus:ring-blue-400"
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="m-4 text-center">
                <label
                  className="block text-gray-600 text-sm font-semibold"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  className="w-full px-3 py-2 m-1 border rounded-md shadow-sm focus:ring focus:ring-blue-400"
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="m-4 text-center">
                <label
                  className="block text-gray-600 text-sm font-semibold"
                  htmlFor="time"
                >
                  Time
                </label>
                <input
                  className="w-full px-3 py-2 m-1 border rounded-md shadow-sm focus:ring focus:ring-blue-400"
                  type="time"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
              <div className="m-4 text-center">
                <label
                  className="block text-gray-600 text-sm font-semibold"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 m-1 border rounded-md shadow-sm focus:ring focus:ring-blue-400"
                  name="description"
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row justify-center gap-5">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>

                <CloseButton
                  mode={() => editMode(false)}
                  data={() => editData(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
