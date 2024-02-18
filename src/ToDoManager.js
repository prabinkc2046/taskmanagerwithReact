import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ListTask from './ListTask';
import ConfirmationModal from './ConfirmationModal';

export default function ToDoManager() {
  const [completedTask, setCompletedTask] = useState([]);
  const [incompletedTask, setInCompletedTask] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const taskNameRef = useRef();
  const categoryRef = useRef();
  const [activeAccordion, setActiveAccordion] = useState(() => {
    const storedActiveAccordion = localStorage.getItem('activeAccordion');
    return storedActiveAccordion ? JSON.parse(storedActiveAccordion) : null;
  });

  useEffect(() => {
    localStorage.setItem('activeAccordion', JSON.stringify(activeAccordion));
  }, [activeAccordion]);

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
      setShowModal(true);
      setSelectedTask(newTask);
      return;
    }

    const updatedIncompletedTask = [...incompletedTask, newTask];
    setInCompletedTask(updatedIncompletedTask.reverse());
    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
  };

  const handleCompletedTask = (id) => {
    const purchasedTask = completedTask.find(task => task.task_id === id);
    if (purchasedTask) {
      purchasedTask.completed = false;
      const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);
      const updatedIncompletedTask = [...incompletedTask, purchasedTask];
      setInCompletedTask(updatedIncompletedTask);
      setCompletedTask(updatedCompletedTask);
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
    }
  };

  const formatDate = (date) => {
    const option = { weekday: 'short', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', option);
  };

  const handleTaskCompleteStatus = (id) => {
    const taskToUpdate = incompletedTask.find(task => task.task_id === id);
    if (taskToUpdate) {
      taskToUpdate.completed = true;
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      taskToUpdate.purchasedDate = formattedDate;
      const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
      const updatedCompletedTask = [...completedTask, taskToUpdate];

      setInCompletedTask(updatedIncompletedTask);
      setCompletedTask(updatedCompletedTask);
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
    }
  };

  const handleDeleteTask = (id) => {
    const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
    const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);

    setInCompletedTask(updatedIncompletedTask);
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const task_name = taskNameRef.current.value;
    let category = categoryRef.current.value;
    category = category.trim() === "" ? "Uncategorised items" : category;
    const newTask = {
      task_id: new Date().getTime(),
      task_name: task_name,
      completed: false,
      category: category,
      flash: true,
    };
    taskNameRef.current.value = '';
    categoryRef.current.value = '';
    postTask(newTask);

    if (activeAccordion !== category) {
      setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    }

    saveToHistory(newTask);
    setSuggestions([]);
  };

  const saveToHistory = (task) => {
    const existingHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    const isTaskAlreadyExists = existingHistory.some(existingTask => existingTask.task_name === task.task_name);

    if (!isTaskAlreadyExists) {
      const updatedHistory = [task, ...existingHistory];
      setHistory(updatedHistory);
      localStorage.setItem('taskHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const filteredSuggestions = history.filter((task) => task.task_name.toLowerCase().startsWith(inputValue.toLowerCase()));
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (task) => {
    taskNameRef.current.value = task.task_name;
    categoryRef.current.value = task.category;
    setSuggestions([]);
  };

  const handleModalConfirmation = (confirmed) => {
    if (confirmed) {
      const existingTask = incompletedTask.find(task => task.task_name === selectedTask.task_name && task.category === selectedTask.category);
      if (existingTask) {
        postTask(selectedTask);
        const updatedIncompletedTask = [...incompletedTask, selectedTask];
        setInCompletedTask(updatedIncompletedTask);
        updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
      }
    }

    setShowModal(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedIncompletedTask = incompletedTask.map(task => ({ ...task, flash: false }));
      setInCompletedTask(updatedIncompletedTask);
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
    }, 3000);

    return () => clearTimeout(timer);
  }, [incompletedTask]);

  const removeSuggestion = () => {
    setSuggestions([]);
  };

  const toggleAccordion = (category) => {
    setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    removeSuggestion();
  };

  const [sortedCategory, setSortedCategory] = useState([]);
  const [lastEmptyTaskTime, setLastEmptyTaskTime] = useState(null);
  const [daysSinceLastEmptyTask, setDaysSinceLastEmptyTask] = useState(null);
  const categories = Array.from(new Set(sortedCategory.map(task => task.category)));
  const purchasedDates = Array.from(new Set(completedTask.map(task => task.purchasedDate)));

  useEffect(() => {
    processTasks(incompletedTask);
  }, [incompletedTask]);

  function processTasks(incompletedTasks) {
    const categoryTasks = {};
    incompletedTasks.forEach(task => {
      if (!categoryTasks[task.category] || task.task_id > categoryTasks[task.category].task_id) {
        categoryTasks[task.category] = { category: task.category, task_id: task.task_id };
      }
    });
    const sortedCategoryTasks = Object.values(categoryTasks).sort((a, b) => b.task_id - a.task_id);
    setSortedCategory(sortedCategoryTasks);

    if (incompletedTasks.length === 0) {
      setLastEmptyTaskTime(new Date());
    }
  }

  useEffect(() => {
    if (lastEmptyTaskTime) {
      const currentDate = new Date();
      const differenceInTime = Math.abs(currentDate - lastEmptyTaskTime);
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
      setDaysSinceLastEmptyTask(differenceInDays);
    }
  }, [lastEmptyTaskTime]);

  const handlePurchasedTask = (id) => {
    handleCompletedTask(id);
  };

  const handleIncompleteTaskClick = (id) => {
    handleTaskCompleteStatus(id);
  };

  const handleCompletedTaskDelete = (id) => {
    handleDeleteTask(id);
  };

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
        removeSuggestion={removeSuggestion}
      />

      <ConfirmationModal showModal={showModal} handleModalConfirmation={handleModalConfirmation} />

      <p></p>

      <ListTask
        fetchTask={() => { }}
        handleTaskCompleteStatus={handleTaskCompleteStatus}
        completedTask={completedTask}
        incompletedTask={incompletedTask}
        handleCompletedTask={handleCompletedTask}
        handleDeleteTask={handleDeleteTask}
        removeSuggestion={removeSuggestion}
        activeAccordion={activeAccordion}
        toggleAccordion={toggleAccordion}
        categories={categories}
        handleIncompleteTaskClick={handleIncompleteTaskClick}
        daysSinceLastEmptyTask={daysSinceLastEmptyTask}
        purchasedDates={purchasedDates}
        handlePurchasedTask={handlePurchasedTask}
        handleCompletedTaskDelete={handleCompletedTaskDelete}
      />
    </>
  );
}
