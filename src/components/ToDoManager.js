// Importing necessary modules and components
import React, { useState, useEffect, useRef} from 'react';
import Form from './Form';
import ListTask from './ListTask';
import ConfirmationModal from './ConfirmationModal';
import axios from 'axios';
const api = process.env.REACT_APP_API; // API endpoint

// Main component for managing tasks
export default function ToDoManager() {
  // State variables initialization
  const [data, setData] = useState([]);
  const [completedTask, setCompletedTask] = useState([]); // List of completed tasks
  const [incompletedTask, setInCompletedTask] = useState([]); // List of incomplete tasks
  const [suggestions, setSuggestions] = useState([]); // Suggestions for task names
  const [Oursuggestions, setOurSuggestions] = useState([]); // Suggestions fetched from the server
  const [selectedSuggestion, setSelectedSuggestion] = useState(null); // Currently selected suggestion
  const [history, setHistory] = useState([]); // Task history
  const [showModal, setShowModal] = useState(false); // Flag to control visibility of confirmation modal
  const [selectedTask, setSelectedTask] = useState(null); // Task selected for confirmation
  const [dbHasData, setDbHasData] = useState(false); // Flag indicating whether server has data for suggestions
  const [historyHasData, setHistoryHasData] = useState(!dbHasData); // Flag indicating whether local history has data
  const taskNameRef = useRef(); // Reference to task name input field
  const categoryRef = useRef(); // Reference to category input field
  const [activeAccordion, setActiveAccordion] = useState(() => {
    // Initialize active accordion state from local storage or null
    const storedActiveAccordion = localStorage.getItem('activeAccordion');
    return storedActiveAccordion ? JSON.parse(storedActiveAccordion) : null;
  });

  // Effect to save active accordion state to local storage
  useEffect(() => {
    localStorage.setItem('activeAccordion', JSON.stringify(activeAccordion));
  }, [activeAccordion]);

  // Effect to initialize tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || { incompletedTask: [], completedTask: [] };
    setInCompletedTask(storedTasks.incompletedTask);
    setCompletedTask(storedTasks.completedTask);
  }, []);

  // Function to update local storage with tasks
  const updateLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Function to add new task
  const postTask = (newTask) => {
    // Check if task with same name and category already exists
    const existingTask = incompletedTask.find(task => task.task_name === newTask.task_name && task.category === newTask.category);
    if (existingTask) {
      setShowModal(true); // Show confirmation modal
      setSelectedTask(newTask); // Set selected task for confirmation
      return;
    }

    const updatedIncompletedTask = [...incompletedTask, newTask]; // Add new task to incomplete tasks
    setInCompletedTask(updatedIncompletedTask.reverse()); // Reverse order for better display
    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask }); // Update local storage
  };

  // Function to handle marking task as incomplete
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

  // Function to format date
  const formatDate = (date) => {
    const option = { weekday: 'short', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', option);
  };

  // Function to handle marking task as complete
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

  // Function to handle task deletion
  const handleDeleteTask = (id) => {
    const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
    const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);

    setInCompletedTask(updatedIncompletedTask);
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  // Function to handle form submission
  const handleSubmitForm = (e) => {
    e.preventDefault();
    let task_name = taskNameRef.current.value;
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

  // Function to save task to history
  const saveToHistory = (task) => {
    const existingHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    const isTaskAlreadyExists = existingHistory.some(existingTask => existingTask.task_name === task.task_name);

    if (!isTaskAlreadyExists) {
      const updatedHistory = [task, ...existingHistory];
      setHistory(updatedHistory);
      localStorage.setItem('taskHistory', JSON.stringify(updatedHistory));
    }
  };

  //pull the fresh data on change of date
  const currentDate = new Date().getDate();
  useEffect(()=>{
    const fetchFreshData = async()=>{
      try{
        console.log("pulling data");
        const response = await axios.get(api);
        const items = response.data.items;
        setData(items);
      }catch(e){
        console.log("Error", e.message);
      }
    };
    fetchFreshData();
  },[currentDate]);
  // Function to handle input change for suggestions
  const handleInputChange = async(e) => {
    const inputValue = e.target.value.toLowerCase();
    const matchedItems = data.filter(item => item.item.startsWith(inputValue));
    const filteredSuggestions = history.filter((task) => task.task_name.toLowerCase().startsWith(inputValue));

    if (inputValue !== "" && filteredSuggestions.length > 0){
      setSuggestions(filteredSuggestions);
      setDbHasData(false);
      setHistoryHasData(true);
    } else if (inputValue !== "" && matchedItems.length > 0){
        setOurSuggestions(matchedItems);
        setDbHasData(true);
        setHistoryHasData(false);
    } else if(inputValue === "" || filteredSuggestions.length === 0){
        setSuggestions([]);
        setOurSuggestions([]);
        categoryRef.current.value = "";
    }
    else {
      console.log("something went wrong")
      }
  }

  // Function to handle suggestion click
  const handleSuggestionClick = (objectItem) => {
    if (objectItem.item && objectItem.item !== ""){
      taskNameRef.current.value = objectItem.item;
      categoryRef.current.value = objectItem.category;
      setOurSuggestions([]);
      
    } else{
      taskNameRef.current.value = objectItem.task_name;
      categoryRef.current.value = objectItem.category;
      setSuggestions([]);
      
    }
    
  };

  // Function to handle confirmation modal
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

  // Effect to initialize history from local storage on component mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    setHistory(storedHistory);
  }, []);

  // Effect to remove flash after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedIncompletedTask = incompletedTask.map(task => ({ ...task, flash: false }));
      setInCompletedTask(updatedIncompletedTask);
      updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
    }, 3000);

    return () => clearTimeout(timer);
  }, [incompletedTask]);

  // Function to remove suggestions
  const removeSuggestion = () => {
    setSuggestions([]);
    setOurSuggestions([]);
  };

  // Function to toggle accordion
  const toggleAccordion = (category) => {
    setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    removeSuggestion();
  };

  // State variables for sorting tasks and tracking empty task time
  const [sortedCategory, setSortedCategory] = useState([]);
  const [lastEmptyTaskTime, setLastEmptyTaskTime] = useState(null);
  const [daysSinceLastEmptyTask, setDaysSinceLastEmptyTask] = useState(null);
  const categories = Array.from(new Set(sortedCategory.map(task => task.category)));
  const purchasedDates = Array.from(new Set(completedTask.map(task => task.purchasedDate)));

  // Effect to process incomplete tasks and update empty task time
  useEffect(() => {
    processTasks(incompletedTask);
  }, [incompletedTask]);

  // Function to process incomplete tasks
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

  // Effect to calculate days since last empty task
  useEffect(() => {
    if (lastEmptyTaskTime) {
      const currentDate = new Date();
      const differenceInTime = Math.abs(currentDate - lastEmptyTaskTime);
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
      setDaysSinceLastEmptyTask(differenceInDays);
    }
  }, [lastEmptyTaskTime]);

  // Function to handle purchased task
  const handlePurchasedTask = (id) => {
    handleCompletedTask(id);
  };

  // Function to handle incomplete task click
  const handleIncompleteTaskClick = (id) => {
    handleTaskCompleteStatus(id);
  };

  // Function to handle completed task deletion
  const handleCompletedTaskDelete = (id) => {
    handleDeleteTask(id);
  };

  // Rendering components
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
        dbHasData={dbHasData}
        historyHasData={historyHasData}
        Oursuggestions={Oursuggestions}
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
