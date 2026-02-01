import React, { useReducer, useEffect } from 'react';
import { useLocalStorage } from '../../hook/useLocalStorage';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import FilterControls from './FilterControls';

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'TOGGLE_TASK':
      return state.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload);
    case 'SET_PRIORITY':
      return state.map(task =>
        task.id === action.payload.id ? { ...task, priority: action.payload.priority } : task
      );
    case 'CLEAR_COMPLETED':
      return state.filter(task => !task.completed);
    case 'SET_TASKS':
      return action.payload;
    default:
      return state;
  }
};

export default function TodoApp() {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [filter, setFilter] = useLocalStorage('todoFilter', 'all');
  const [storedTasks, setStoredTasks] = useLocalStorage('tasks', []);

  // Initialize tasks from localStorage
  useEffect(() => {
    dispatch({ type: 'SET_TASKS', payload: storedTasks });
  }, []);

  // Persist tasks to localStorage
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleAddTask = (task) => {
    dispatch({ type: 'ADD_TASK', payload: { ...task, id: Date.now(), completed: false } });
  };

  const handleToggleTask = (id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleDeleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleSetPriority = (id, priority) => {
    dispatch({ type: 'SET_PRIORITY', payload: { id, priority } });
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="max-w-full sm:max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Enhanced Todo App
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your tasks with priority levels and filters
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm">
          <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-center">
            Total: {stats.total}
          </div>
          <div className="px-3 py-2 bg-green-100 text-green-800 rounded-full text-center">
            Active: {stats.active}
          </div>
          <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-center">
            Completed: {stats.completed}
          </div>
        </div>
      </div>

      {/* Task Form */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Filter Controls */}
      <div className="mt-4">
        <FilterControls filter={filter} setFilter={setFilter} />
      </div>

      {/* Task List */}
      <div className="mt-6">
        <TaskList
          tasks={filteredTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onSetPriority={handleSetPriority}
        />
      </div>
    </div>
  );
}