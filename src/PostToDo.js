import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ListTask from './ListTask';

export default function PostToDo() {
  const [completedTask, setCompletedTask] = useState([]);
  const [incompletedTask, setInCompletedTask] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const taskNameRef = useRef();

  // Fetch data from local storage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || { incompletedTask: [], completedTask: [] };
    setInCompletedTask(storedTasks.incompletedTask);
    setCompletedTask(storedTasks.completedTask);
  }, [isChecked]);

  const updateLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const postTask = (newTask) => {
    const updatedIncompletedTask = [...incompletedTask, newTask];
    setInCompletedTask(updatedIncompletedTask);
    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
  };

  const updateTask = (id, updatedTask) => {
    const updatedIncompletedTask = incompletedTask.map(task =>
      task.task_id === id ? updatedTask : task
    );
    setInCompletedTask(updatedIncompletedTask);

    const updatedCompletedTask = completedTask.map(task =>
      task.task_id === id ? updatedTask : task
    );
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  const deleteTask = (id) => {
    const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
    setInCompletedTask(updatedIncompletedTask);

    const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const task_name = taskNameRef.current.value;
    const newTask = {
      task_id: new Date().getTime(),
      task_name: task_name,
      completed: false,
    };
    taskNameRef.current.value = '';
    postTask(newTask);
  };

  const handleTaskCompleteStatus = (id) => {
    const updatedTask = incompletedTask.find(task => task.task_id === id);
    updatedTask.completed = true;

    const updatedIncompletedTask = incompletedTask.filter(task => task.task_id !== id);
    const updatedCompletedTask = [...completedTask, updatedTask];

    setInCompletedTask(updatedIncompletedTask);
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  const handleCompletedTask = (id) => {
    const updatedTask = completedTask.find(task => task.task_id === id);
    updatedTask.completed = false;

    const updatedCompletedTask = completedTask.filter(task => task.task_id !== id);
    const updatedIncompletedTask = [...incompletedTask, updatedTask];

    setInCompletedTask(updatedIncompletedTask);
    setCompletedTask(updatedCompletedTask);

    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask: updatedCompletedTask });
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  return (
    <>
      <Form onSubmit={handleSubmitForm} taskNameRef={taskNameRef} />

      <p></p>

      <ListTask
        fetchTask={() => {}}
        handleTaskCompleteStatus={handleTaskCompleteStatus}
        checked={isChecked}
        completedTask={completedTask}
        incompletedTask={incompletedTask}
        handleCompletedTask={handleCompletedTask}
        handleDeleteTask={handleDeleteTask}
      />
    </>
  );
}


// import React, {useState, useEffect, useRef} from 'react';
// import axios from 'axios';
// import Form from './Form';
// import ListTask from './ListTask';

// const endpoint = process.env.REACT_APP_API_ENDPOINT;

// export default function PostToDo() {
//     const [completedTask, setCompletedTask] = useState([]);
//     const [incompletedTask, setInCompletedTask] = useState([]);
//     const [isChecked, setIsChecked] = useState(false);
//     const taskNameRef = useRef();
//     const postTask = async (newTask) => {
//         try {
//             const response = await axios.post(endpoint, newTask, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             });
//             if (response.status){
//                 console.log("Task is being added");
//                 fetchTask();
//             }
            
//         } catch (error){
//             console.error(error)
//         }
        
//     };

//     const updateTask = async (id, updatedTask) => {
//         const updateEndpoint = `${endpoint}/${id}`;
//         const response = await axios.put(updateEndpoint, updatedTask, {
//             'headers': {
//                 'Content-Type': 'application/json',
//             }
//         });
//         if (response.status === 200){
//             console.log("data is updated successfully.");
//             setIsChecked(!isChecked);
//         }
//     };

//     const fetchTask = async () => {
//         // const endpoint = "http://127.0.0.1:5000/todos";
//         const response = await axios.get(endpoint);
//         const taskList = response.data.tasks;
//         const incompletedTask = taskList.filter((task) => {
//             return !task.completed
//         });
//         setInCompletedTask(incompletedTask.reverse());

//         const completedTask = taskList.filter((task) => {
//             return task.completed
//         });
//         setCompletedTask(completedTask.reverse());

//       };
    
//     const deleteTask = async (id) => {
//         const deleteEndpoint = `${endpoint}/${id}`;
//         const response = await axios.delete(deleteEndpoint, {
//             'headers': {
//                 'Content-Type': 'application/json',
//             }
//         });
//         if (response.status === 200){
//             console.log("Task  is deleted successfully.");
//             setIsChecked(!isChecked);
//         }
//     };

//     const handleSubmitForm = (e) => {
//         e.preventDefault();
//         const task_name = taskNameRef.current.value;
//         const newTask = {
//             task_name: task_name
//         };
//         taskNameRef.current.value = null;
//         postTask(newTask);
//     };

//     const handleTaskCompleteStatus = (id) => {
//         incompletedTask.map((task) => {
//             if (task.task_id === id){
//                 // const taskIndex = taskList.findIndex(task => task.task_id === id);
//                 // const updatedTaskList = [...taskList];
//                 // updatedTaskList[taskIndex] = {...updatedTaskList[taskIndex], completed: !task.completed}
//                 // setTaskList(updatedTaskList);
//                 const updatedTask = {...task, completed: !task.completed};
//                 updateTask(task.task_id, updatedTask);
//             }
//         })
//     };

//     const handleCompletedTask = (id) => {
//         completedTask.map((task) => {
//             if (task.task_id === id){
//                 // const taskIndex = taskList.findIndex(task => task.task_id === id);
//                 // const updatedTaskList = [...taskList];
//                 // updatedTaskList[taskIndex] = {...updatedTaskList[taskIndex], completed: !task.completed}
//                 // setTaskList(updatedTaskList);
//                 const updatedTask = {...task, completed: !task.completed};
//                 updateTask(task.task_id, updatedTask);
//             }
//         })
//     };

//     const handleDeleteTask = (id) => {
//         deleteTask(id)
//     }
//   return (
//     <>
//     <Form onSubmit={handleSubmitForm} 
//     taskNameRef={taskNameRef}/> 
    
//     <p></p>

//     <ListTask 
//     fetchTask={fetchTask}
//     handleTaskCompleteStatus={handleTaskCompleteStatus}
//     checked={isChecked}
//     completedTask={completedTask}
//     incompletedTask={incompletedTask}
//     handleCompletedTask={handleCompletedTask}
//     handleDeleteTask={handleDeleteTask}
//     />

//     </>
//   );
// };