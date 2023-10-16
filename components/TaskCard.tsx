

const TaskCard = ({name,date,time,description,onEditClick,onDeleteClick}:{
    name: string,
    date: string,
    time: string,
    description: string,
    onEditClick: () => void,
    onDeleteClick: () => void,
}) => {


    

    return (
        <div className="task-card bg-white rounded-lg p-4 shadow-md">
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
            <button onClick={onEditClick} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Edit
            </button>
            <button onClick={onDeleteClick} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Delete
            </button>
          </div>
        </div>
      );
};

export default TaskCard;