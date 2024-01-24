import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ListTask from './ListTask';

export default function PostToDo() {
  const [completedTask, setCompletedTask] = useState([]);
  const [incompletedTask, setInCompletedTask] = useState([]);
  const taskNameRef = useRef();
  const categoryRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState('Choose a category');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || { incompletedTask: [], completedTask: [] };
    setInCompletedTask(storedTasks.incompletedTask);
    setCompletedTask(storedTasks.completedTask);
  }, []);

  const updateLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const postTask = (newTask) => {
    const updatedIncompletedTask = [...incompletedTask, newTask];
    setInCompletedTask(updatedIncompletedTask);
    updateLocalStorage({ incompletedTask: updatedIncompletedTask, completedTask });
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
    };
    taskNameRef.current.value = '';
    categoryRef.current.value = 'Choose a category';
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

  return (
    <>
      <Form onSubmit={handleSubmitForm} taskNameRef={taskNameRef} categoryRef={categoryRef} />

      <p></p>

      <ListTask
        fetchTask={() => {}}
        handleTaskCompleteStatus={handleTaskCompleteStatus}
        completedTask={completedTask}
        incompletedTask={incompletedTask}
        handleCompletedTask={() => {}}
        handleDeleteTask={() => {}}
        selectedCategory={selectedCategory}
      />
    </>
  );
}
