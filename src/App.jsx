import React, { useState } from 'react';
import { CheckSquare, FileText, BarChart3, Clock, Search } from 'lucide-react';
import TodoApp from './components/Todo/TodoApp';
import UserForm from './components/Forms/UserForm';
import MultiProgressBar from './components/Progress/MultiProgressBar';
import CountdownTimer from './components/Timer/CountdownTimer';
import SearchList from './components/Search/SearchList';

function App() {
  const [activeTab, setActiveTab] = useState('timer');

  const tabs = [
    { id: 'todo', label: 'Todo App', icon: <CheckSquare size={20} />, component: <TodoApp /> },
    { id: 'form', label: 'User Form', icon: <FileText size={20} />, component: <UserForm /> },
    { id: 'progress', label: 'Progress Bars', icon: <BarChart3 size={20} />, component: <MultiProgressBar /> },
    { id: 'timer', label: 'Countdown Timer', icon: <Clock size={20} />, component: <CountdownTimer /> },
    { id: 'search', label: 'Live Search', icon: <Search size={20} />, component: <SearchList /> },
  ];

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
       
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
              Todo-Application
            </h1>

            <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden p-4 sm:p-6">
          {activeComponent}
        </div>
      </main>
    </div>
  );
}

export default App;