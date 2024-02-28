// Importing necessary modules and components
import React, { useState, useEffect, useRef, useCallback} from 'react';
import debounce from './debounce';
import Form from './Form';
import InCompletedTask from './InCompletedTask';
import CompletedTask from './CompletedTask';
import ConfirmationModal from './ConfirmationModal';
import axios from 'axios';
const api = process.env.REACT_APP_API; // API endpoint

// Main component for managing tasks
export default function ToDoManager() {
  // State variables initialization
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState(''); // keep track of change of input value
  const [completedTask, setCompletedTask] = useState([]); // List of completed tasks
  const [incompletedTask, setInCompletedTask] = useState([]); // List of incomplete tasks
  const [suggestions, setSuggestions] = useState([]); // Suggestions for task names
  const [selectedSuggestion, setSelectedSuggestion] = useState(null); // Currently selected suggestion
  const [history, setHistory] = useState([]); // Task history
  const [showModal, setShowModal] = useState(false); // Flag to control visibility of confirmation modal
  const [selectedTask, setSelectedTask] = useState(null); // Task selected for confirmation
  const taskNameRef = useRef(); // Reference to task name input field
  const categoryRef = useRef(); // Reference to category input field
  const [activeAccordion, setActiveAccordion] = useState(() => {
    // Initialize active accordion state from local storage or null
    const storedActiveAccordion = localStorage.getItem('activeAccordion');
    return storedActiveAccordion ? JSON.parse(storedActiveAccordion) : null;
  });
  const totalItems = history.concat(data); //array of items combined with history and from database

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


  const handleCompletedTask = (id) => {
    // getting the index of the task being clicked
   const taskIndex = completedTask.findIndex(task => task.task_id === id); 
  //  if the index of task exits
   if (taskIndex !== -1){
    // access the task from the copy of completed task and set completed to false
    const updatedTask = {...completedTask[taskIndex], completed: false};
    // getting the copy of completed task for splice operation
    const updatedCompletedTask = [...completedTask];
    // remove the task by using its task index
    updatedCompletedTask.splice(taskIndex, 1);
    //add the updated task to the copy of incompleted task
    const updatedIncompletedTask = [...incompletedTask, updatedTask];
    //set the state
    setInCompletedTask(updatedIncompletedTask);
    setCompletedTask(updatedCompletedTask);
    updateLocalStorage({incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask})
   }
  }

  // Function to format date
  const formatDate = (date) => {
    const option = { weekday: 'short', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', option);
  };

  // Function to handle marking task as complete
  const handleTaskCompleteStatus = (id) => {
    //access the index of the clicked item
    const taskIndex = incompletedTask.findIndex(task => task.task_id === id);
    //only if index exits
    if (taskIndex !== -1){
      //access the item with the index from the copy of the incompleted task and set completed to true
      const updatedTask = {...incompletedTask[taskIndex], completed: true}
      // get the copy of current incompleted task which also contains the updated task
      const updatedIncompletedTask = [...incompletedTask];
      //Remove the updated task from incomplete task array by using its index
      updatedIncompletedTask.splice(taskIndex,1);
      //set new property purchasedDate to the updated task object
      updatedTask.purchasedDate = formatDate(new Date());
      // get the copy of current completed task and add to it new updated completed task with purchased date property
      const  updatedCompletedTask = [...completedTask, updatedTask];
      //set the new updated value to these states
      setInCompletedTask(updatedIncompletedTask);
      setCompletedTask(updatedCompletedTask);
      updateLocalStorage({incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask})
    }

  }
  
  // Function to handle task deletion
  const handleDeleteTask = (id) => {
    const taskIndex = completedTask.findIndex(task => task.task_id === id);
    if (taskIndex !== -1){
      console.log("task index is", taskIndex);
      const updatedCompletedTask = [...completedTask];
      updatedCompletedTask.splice(taskIndex,1);
      setCompletedTask(updatedCompletedTask);
      updateLocalStorage({ incompletedTask: incompletedTask, completedTask: updatedCompletedTask });
    }
  }

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
    // setSuggestions([]);
  };

  // Function to save task to history
  const saveToHistory = (task) => {
    const existingHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
    const isTaskAlreadyExists = existingHistory.some(existingTask => existingTask.task_name === task.task_name);
    console.log(isTaskAlreadyExists);
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

  useEffect(()=>{
    // state update or function that update states with be called with delay
    const timerOut = setTimeout(()=>{
      if (!inputValue){
        setSuggestions([]);
        categoryRef.current.value = "";
        return;
      }
      const searchedItems = totalItems.filter(obj =>{
        return (obj.task_id && obj.task_name.startsWith(inputValue)) || (obj._id && obj.item.startsWith(inputValue))
      });
      if (searchedItems.length > 0){
        setSuggestions(searchedItems);
      } else {
        setSuggestions([]);
        categoryRef.current.value = "";
        console.log("Searched Item not found");
      }
    },500);

    return ()=>{
      clearTimeout(timerOut);
    }
  },[inputValue]); // whenever input value is changed, we run use effect

  const handleInputChange = async (e) => {
    // setting the input value
    setInputValue(e.target.value.toLowerCase().trim());
  }
    
  // Function to handle suggestion click
  const handleSuggestionClick = (objectItem) => {
    const {item, task_name, category} = objectItem;
    if (objectItem.item && objectItem.item !== ""){
      taskNameRef.current.value = item;
      categoryRef.current.value = category;
      setSuggestions([]);
   
    } else{
      taskNameRef.current.value = task_name;
      categoryRef.current.value = category;
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
  };

  // Function to toggle accordion
  const toggleAccordion = (category) => {
    setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    removeSuggestion();
  };

  //debounce the toggle Accordion function so that it does not change on quick touch
  const debouncedToggleAccordion = useCallback(debounce(toggleAccordion,500),[]);

  // State variables for sorting tasks and tracking empty task time
  const [sortedCategory, setSortedCategory] = useState([]);
  const [lastEmptyTaskTime, setLastEmptyTaskTime] = useState(null);
  const [daysSinceLastEmptyTask, setDaysSinceLastEmptyTask] = useState(null);
  const categories = Array.from(new Set(sortedCategory.map(task => task.category)));
  const purchasedDates = Array.from(new Set(completedTask.map(task => task.purchasedDate))).reverse();

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

  // Effect to process incomplete tasks and update empty task time
  useEffect(() => {
    processTasks(incompletedTask);
  }, [incompletedTask]);

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
      />

      <ConfirmationModal showModal={showModal} handleModalConfirmation={handleModalConfirmation} />

      <p></p>

      <InCompletedTask
      completedTask={completedTask}
      incompletedTask={incompletedTask}
      categories={categories}
      activeAccordion={activeAccordion}
      toggleAccordion={debouncedToggleAccordion}
      handleIncompleteTaskClick={handleIncompleteTaskClick}
      daysSinceLastEmptyTask={daysSinceLastEmptyTask}
      />
      
      <CompletedTask
        completedTask={completedTask}
        purchasedDates={purchasedDates}
        handlePurchasedTask={handlePurchasedTask}
        handleCompletedTaskDelete={handleCompletedTaskDelete}
        activeAccordion={activeAccordion}
        toggleAccordion={debouncedToggleAccordion}
      />
    </>
  );
}
