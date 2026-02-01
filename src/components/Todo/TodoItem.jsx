import React from "react";

function TodoItem({ task, dispatch }) {

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <li className="flex justify-between items-center border rounded-lg p-3 my-2 shadow-sm hover:bg-gray-50 transition-colors">

      <div className="flex items-center gap-3">
        <span
          className={`text-gray-800 ${task.completed ? "line-through text-gray-400" : ""}`}
        >
          {task.text}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Action buttons */}
      <div className="space-x-2">
        <button
          onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            task.completed
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {task.completed ? "Undo" : "Done"}
        </button>
        <button
          onClick={() => dispatch({ type: "DELETE_TASK", payload: task.id })}
          className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;