import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function MultiProgressBar() {
  // Each bar is now an object: { label, value }
  const [inputs, setInputs] = useState(() => {
    const saved = localStorage.getItem("progressBars");
    return saved ? JSON.parse(saved) : [
      { label: "Bar 1", value: 25 },
      { label: "Bar 2", value: 50 },
      { label: "Bar 3", value: 75 },
      { label: "Bar 4", value: 30 },
      { label: "Bar 5", value: 90 },
    ];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem("progressBars", JSON.stringify(inputs));
  }, [inputs]);

  const total = inputs.reduce((sum, bar) => sum + bar.value, 0);
  const average = total / inputs.length;
  const maxTotal = inputs.length * 100;

  const handleChange = (index, value) => {
    const newValue = Math.min(100, Math.max(0, Number(value) || 0));
    const newInputs = [...inputs];
    newInputs[index].value = newValue;
    setInputs(newInputs);
  };

  const handleLabelChange = (index, label) => {
    const newInputs = [...inputs];
    newInputs[index].label = label;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < 10) {
      setInputs([...inputs, { label: `Bar ${inputs.length + 1}`, value: 0 }]);
    }
  };

  const removeInput = (index) => {
    if (inputs.length > 1) {
      const newInputs = inputs.filter((_, i) => i !== index);
      setInputs(newInputs);
    }
  };

  const getBarColor = (value) => {
    if (value < 30) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Dynamic Progress Bars</h2>
      <p className="text-gray-600 mb-6">Adjust individual progress bars to see the overall progress</p>

      {/* Main Progress Bar */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Overall Progress</h3>
            <p className="text-sm text-gray-500">Based on all input values</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {average.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              {total}/{maxTotal} total
            </div>
          </div>
        </div>
        
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getBarColor(average)} transition-all duration-500 ease-in-out`}
            style={{ width: `${average}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Individual Progress Bars */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Individual Progress Bars</h3>
          <button
            onClick={addInput}
            disabled={inputs.length >= 10}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Add Bar
          </button>
        </div>

        {inputs.map((bar, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <input
                    type="text"
                    value={bar.label}
                    onChange={(e) => handleLabelChange(index, e.target.value)}
                    className="font-medium text-gray-700 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <span className="font-bold text-gray-800">{bar.value}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(bar.value)} transition-all duration-300 ease-in-out`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => removeInput(index)}
                disabled={inputs.length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:text-gray-300 disabled:hover:bg-transparent"
              >
                <Minus size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={bar.value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={bar.value}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-20 p-2 border border-gray-300 rounded-lg text-center"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Total Value</div>
          <div className="text-2xl font-bold text-blue-700">{total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600">Average</div>
          <div className="text-2xl font-bold text-green-700">{average.toFixed(1)}%</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600">Bars</div>
          <div className="text-2xl font-bold text-purple-700">{inputs.length}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-yellow-600">Max Total</div>
          <div className="text-2xl font-bold text-yellow-700">{maxTotal}</div>
        </div>
      </div>
    </div>
  );
}