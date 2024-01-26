import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ListTask from './ListTask';

export default function PostToDo() {
  const [completedTask, setCompletedTask] = useState([]);
  const [incompletedTask, setInCompletedTask] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [history, setHistory] = useState([]);
  const taskNameRef = useRef();
  const categoryRef = useRef();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || { incompletedTask: [], completedTask: [] };
    setInCompletedTask(storedTasks.incompletedTask);
    setCompletedTask(storedTasks.completedTask);
  }, []);

  const updateLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const postTask = (newTask) => {
    const existingTask = incompletedTask.find(task => task.task_name === newTask.task_name && task.category === newTask.category);
    if (existingTask) {
      const shouldAdd = window.confirm('This item is already listed. Would you like to add it again?');
      if (!shouldAdd) return;
    }
  
    const updatedIncompletedTask = [...incompletedTask, newTask];
    setInCompletedTask(updatedIncompletedTask);
    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
  };

  const handleCompletedTask = (id) => {
    const purchasedTask = completedTask.find(task => task.task_id === id);
    if (purchasedTask){
      purchasedTask.completed = false;
      const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);
      const updatedIncompletedTask = [...incompletedTask, purchasedTask];
      setInCompletedTask(updatedIncompletedTask);
      setCompletedTask(updatedCompletedTask);
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
    }
    
  };

  const handleTaskCompleteStatus = (id) => {
    // Find the task with the given id in the incompletedTask state
    const taskToUpdate = incompletedTask.find(task => task.task_id === id);
  
    if (taskToUpdate) {
      // Update the completed property of the task
      taskToUpdate.completed = true;
  
      // Remove the task from incompletedTask and add it to completedTask
      const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
      const updatedCompletedTask = [...completedTask, taskToUpdate];
  
      setInCompletedTask(updatedIncompletedTask);
      setCompletedTask(updatedCompletedTask);
  
      // Update local storage
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
    }
  };
  
  const handleDeleteTask = (id) => {
    // Delete task from both incompletedTask and completedTask
    const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
    const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);

    setInCompletedTask(updatedIncompletedTask);
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const task_name = taskNameRef.current.value;
    const category = categoryRef.current.value;
    const newTask = {
      task_id: new Date().getTime(),
      task_name: task_name,
      completed: false,
      category: category,
      flash: true, // Add flash property for new tasks
    };
    taskNameRef.current.value = '';
    categoryRef.current.value = '';
    postTask(newTask);

    // Save to local storage
    saveToHistory(newTask);

    // Clear the suggestions list if user does not select from the suggestions
    setSuggestions([]);
  };

  const saveToHistory = (task) => {
    // Retrieve existing history from local storage
    const existingHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
  
    // Check if the task already exists in history
    const isTaskAlreadyExists = existingHistory.some(existingTask => existingTask.task_name === task.task_name);
  
    if (!isTaskAlreadyExists) {
      // Update history with the new task
      const updatedHistory = [task, ...existingHistory];
      setHistory(updatedHistory);
      // Save the updated history to local storage
      localStorage.setItem('taskHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const filteredSuggestions = history.filter(
      (task) => task.task_name.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (task) => {
    taskNameRef.current.value = task.task_name;
    categoryRef.current.value = task.category;

    // Clear the suggestions list
    setSuggestions([]);
  };

  useEffect(() => {
    // Load history from local storage on component mount
    const storedHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    // setSuggestions(storedHistory);
    setHistory(storedHistory);
  }, []);

  // Clear flash property after a certain time (e.g., 3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedIncompletedTask = incompletedTask.map(task => ({ ...task, flash: false }));
      setInCompletedTask(updatedIncompletedTask);
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
    }, 3000);

    return () => clearTimeout(timer);
  }, [incompletedTask]);
  
  

  return (
    <>
      <Form 
        handleSubmitForm={handleSubmitForm} 
        taskNameRef={taskNameRef} 
        categoryRef={categoryRef}
        handleSuggestionClick={handleSuggestionClick}
        handleInputChange={handleInputChange}
        suggestions={suggestions}
        selectedSuggestion={selectedSuggestion}
      />
      <p></p>

      <ListTask
        updateList={() => {}}
        fetchTask={() => {}}
        handleTaskCompleteStatus={handleTaskCompleteStatus}
        checked={false}
        completedTask={completedTask}
        incompletedTask={incompletedTask}
        handleCompletedTask={handleCompletedTask}
        handleDeleteTask={handleDeleteTask}
      />
    </>
  );
}
