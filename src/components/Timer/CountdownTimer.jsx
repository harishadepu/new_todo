import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const CountdownTimer = () => {
  const [initialSeconds, setInitialSeconds] = useLocalStorage('timerInitialSeconds', 10);
  const [remainingMs, setRemainingMs] = useState(initialSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pausedAt, setPausedAt] = useState(null);

  useEffect(() => {
    const savedState = localStorage.getItem('timerPersistentState');
    if (savedState) {
      const { remaining, running, paused, startTimestamp, pausedTimestamp, completed } = JSON.parse(savedState);

      if (running && startTimestamp && !paused) {
        const elapsed = Date.now() - startTimestamp;
        const newRemaining = Math.max(0, remaining - elapsed);
        if (newRemaining > 0) {
          setRemainingMs(newRemaining);
          setIsRunning(true);
          setStartTime(startTimestamp);
        } else {
          setRemainingMs(0);
          setIsCompleted(true);
        }
      } else if (paused && pausedTimestamp) {
        setRemainingMs(remaining);
        setIsPaused(true);
        setPausedAt(pausedTimestamp);
      } else if (completed) {
        setRemainingMs(0);
        setIsCompleted(true);
      }
    }
  }, []);


  useEffect(() => {
    const timerState = {
      remaining: remainingMs,
      running: isRunning,
      paused: isPaused,
      startTimestamp: startTime,
      pausedTimestamp: pausedAt,
      completed: isCompleted,
      initialSeconds: initialSeconds,
      lastUpdated: Date.now()
    };
    localStorage.setItem('timerPersistentState', JSON.stringify(timerState));
  }, [remainingMs, isRunning, isPaused, startTime, pausedAt, isCompleted, initialSeconds]);

  // Timer logic
  useEffect(() => {
    let intervalId;
    if (isRunning && !isPaused && remainingMs > 0) {
      const startTimestamp = Date.now();
      const expectedRemaining = remainingMs;

      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTimestamp;
        const newRemaining = Math.max(0, expectedRemaining - elapsed);
        setRemainingMs(newRemaining);
        if (newRemaining === 0) handleTimerComplete();
      }, 10);

      return () => clearInterval(intervalId);
    }
  }, [isRunning, isPaused, remainingMs]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(true);
    setStartTime(null);
    setPausedAt(null);
  }, []);

  const handleStart = () => {
    if (remainingMs > 0) {
      setIsRunning(true);
      setIsPaused(false);
      setIsCompleted(false);
      setStartTime(Date.now() - (initialSeconds * 1000 - remainingMs));
      setPausedAt(null);
    }
  };

  const handlePause = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setPausedAt(Date.now());
    }
  };

  const handleResume = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      const pausedDuration = Date.now() - pausedAt;
      setStartTime(prev => prev + pausedDuration);
      setPausedAt(null);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    setRemainingMs(initialSeconds * 1000);
    setStartTime(null);
    setPausedAt(null);
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      const seconds = value === '' ? '' : parseInt(value, 10);
      if (seconds === '' || (seconds > 0 && seconds <= 3600)) {
        setInitialSeconds(seconds === '' ? '' : seconds);
        if (!isRunning && !isPaused && !isCompleted) {
          setRemainingMs(seconds === '' ? 0 : seconds * 1000);
        }
      }
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
        .toString()
        .padStart(3, '0')
        .padEnd(3, '0')}`;
    }
    return `${seconds}.${milliseconds.toString().padStart(3, '0').padEnd(3, '0')}`;
  };

  const progressPercentage =
    ((initialSeconds * 1000 - remainingMs) / (initialSeconds * 1000)) * 100;


  const canStart = !isRunning && !isCompleted && remainingMs > 0;
  const canPause = isRunning && !isPaused && !isCompleted;
  const canResume = isRunning && isPaused && !isCompleted;
  const canReset = (isRunning || isPaused || isCompleted) && initialSeconds > 0;


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <Clock size={24} /> Countdown Timer
      </h2>

      <div className="text-6xl font-mono font-bold mb-6 text-center">
        {formatTime(remainingMs)}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`px-4 py-2 rounded-lg ${
            canStart ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Play size={20} /> Start
        </button>
        <button
          onClick={handlePause}
          disabled={!canPause}
          className={`px-4 py-2 rounded-lg ${
            canPause ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Pause size={20} /> Pause
        </button>
        <button
          onClick={handleResume}
          disabled={!canResume}
          className={`px-4 py-2 rounded-lg ${
            canResume ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Play size={20} /> Resume
        </button>
        <button
          onClick={handleReset}
          disabled={!canReset}
          className={`px-4 py-2 rounded-lg ${
            canReset ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <RotateCcw size={20} /> Reset
        </button>
      </div>

      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            progressPercentage < 30
              ? 'bg-green-500'
              : progressPercentage < 70
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {isCompleted && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <AlertCircle size={20} className="inline-block mr-2 text-red-600" />
          <span className="text-red-600 font-semibold">Time’s up!</span>
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Set Initial Time (seconds)
        </label>
        <input
          type="number"
          min="1"
          max="3600"
          value={initialSeconds}
          onChange={handleTimeChange}
          disabled={isRunning || isCompleted}
          className="w-full p-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default CountdownTimer;