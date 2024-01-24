import React, { useState, useEffect, useRef } from 'react';
import Form from './Form';
import ListTask from './ListTask';

export default function PostToDo() {
  const [completedTask, setCompletedTask] = useState([]);
  const [incompletedTask, setInCompletedTask] = useState([]);
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
      <Form onSubmit={handleSubmitForm} taskNameRef={taskNameRef} categoryRef={categoryRef} />

      <p></p>

      <ListTask
        fetchTask={() => {}}
        handleTaskCompleteStatus={handleTaskCompleteStatus}
        completedTask={completedTask}
        incompletedTask={incompletedTask}
        handleCompletedTask={handleCompletedTask}
        handleDeleteTask={handleDeleteTask}
      />
    </>
  );
}
