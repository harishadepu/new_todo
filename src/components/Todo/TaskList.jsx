import React from 'react';
import { CheckCircle, Circle, Trash2, AlertCircle } from 'lucide-react';

const priorityColors = {
  high: 'bg-red-100 border-red-300',
  medium: 'bg-yellow-100 border-yellow-300',
  low: 'bg-green-100 border-green-300',
};

const priorityIcons = {
  high: <AlertCircle className="text-red-500" size={16} />,
  medium: <AlertCircle className="text-yellow-500" size={16} />,
  low: <AlertCircle className="text-green-500" size={16} />,
};

export default function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks found. Add some tasks to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${priorityColors[task.priority]} transition-all hover:shadow-md`}
        >
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => onToggleTask(task.id)}
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              {task.completed ? (
                <CheckCircle size={24} className="text-green-500" />
              ) : (
                <Circle size={24} />
              )}
            </button>
            <div className="flex items-center gap-2">
              {priorityIcons[task.priority]}
              <span
                className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
              >
                {task.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}