import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

export default function ListTask({ updateList, fetchTask, handleTaskCompleteStatus, checked, completedTask, incompletedTask, handleCompletedTask, handleDeleteTask }) {
  const categories = Array.from(new Set(incompletedTask.map(task => task.category)));

  useEffect(() => {
    fetchTask();
  }, [updateList]);

  useEffect(() => {
    fetchTask();
  }, [checked]);

  return (
    <div className="container mt-5">
      <div className="row">
        {categories.map(category => (
          <div key={category} className="col-md-6">
            <h6>{category}</h6>
            <div className="list-group">
              {incompletedTask
                .filter(task => task.category === category)
                .map(task => (
                  <div
                    key={task.task_id}
                    className={`list-group-item ${task.flash ? 'flash' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-light"
                        onClick={() => handleTaskCompleteStatus(task.task_id)}
                      >
                        {task.task_name}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
