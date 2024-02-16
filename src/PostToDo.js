import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ListTask from './ListTask';
import { format } from 'prettier';

export default function PostToDo() {
  const [completedTask, setCompletedTask] = useState([]);
  const [incompletedTask, setInCompletedTask] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const taskNameRef = useRef();
  const categoryRef = useRef();

  //persist the state of active accordion 
  const [activeAccordion, setActiveAccordion] = useState(() => {
    const storedActiveAccordion = localStorage.getItem('activeAccordion');
    return storedActiveAccordion ? JSON.parse(storedActiveAccordion) : null; 
  });

  useEffect(() => {
    localStorage.setItem('activeAccordion',JSON.stringify(activeAccordion));
  },[activeAccordion]);

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
      return; // Do not proceed further until user confirms
    }
  
    const updatedIncompletedTask = [...incompletedTask, newTask];
    setInCompletedTask(updatedIncompletedTask.reverse());
    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask});
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

  const formatDate = (date) => {
    const option = {weekday: 'short', month: 'short', day: '2-digit'}
    return date.toLocaleDateString('en-US', option);
  };

  const handleTaskCompleteStatus = (id) => {
    // Find the task with the given id in the incompletedTask state
    const taskToUpdate = incompletedTask.find(task => task.task_id === id);
  
    if (taskToUpdate) {
      // Update the completed property of the task
      taskToUpdate.completed = true;
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      console.log(formattedDate);
      taskToUpdate.purchasedDate = formattedDate;
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
    let category = categoryRef.current.value;
    category = category.trim() === "" ? "Uncategorised items" : category;
    const newTask = {
      task_id: new Date().getTime(),
      task_name: task_name,
      completed: false,
      category: category ,
      flash: true, // Add flash property for new tasks
    };
    taskNameRef.current.value = '';
    categoryRef.current.value = '';
    postTask(newTask);

    // when a item is added, this will open the Accordion and if the Accordion is already open for
    // the given category, it will stay open
    if (activeAccordion !== category) {
      setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    }

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

  const handleModalConfirmation = (confirmed) => {
    if (confirmed) {
      // If user confirms, proceed to add the task
      const existingTask = incompletedTask.find(task => task.task_name === selectedTask.task_name && task.category === selectedTask.category);
      if (existingTask) {
        postTask(selectedTask);
        const updatedIncompletedTask = [...incompletedTask, selectedTask];
        setInCompletedTask(updatedIncompletedTask);
        updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
      }
    }
  
    // Reset modal state
    setShowModal(false);
    setSelectedTask(null);
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
    // eslint-disable-next-line
  }, [incompletedTask]);

  //remove the suggestions if add button is not clicked
  const removeSuggestion = () => {
    setSuggestions([]);
  };

  const toggleAccordion = (category) => {
    setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    // remove the suggestion in case user clicks on the add task and do not add task
    removeSuggestion();
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

      {/* Bootstrap Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Duplicate Item</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleModalConfirmation(false)}></button>
            </div>
            <div className="modal-body">
              This item is already listed. Would you like to add it again?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => handleModalConfirmation(false)}>No</button>
              <button type="button" className="btn btn-primary" onClick={() => handleModalConfirmation(true)}>Yes</button>
            </div>
          </div>
        </div>
      </div>
  
      <p></p>

      <ListTask
        // updateList={() => {}}
        fetchTask={() => {}}
        handleTaskCompleteStatus={handleTaskCompleteStatus}
        // checked={false}
        completedTask={completedTask}
        incompletedTask={incompletedTask}
        handleCompletedTask={handleCompletedTask}
        handleDeleteTask={handleDeleteTask}
        removeSuggestion={removeSuggestion}
        activeAccordion={activeAccordion}
        toggleAccordion={toggleAccordion}
      />
    </>
  );
}
