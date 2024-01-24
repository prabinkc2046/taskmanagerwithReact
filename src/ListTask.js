import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

export default function ListTask({
  updateList,
  fetchTask,
  handleTaskCompleteStatus,
  checked,
  completedTask,
  incompletedTask,
  handleCompletedTask,
  handleDeleteTask,
}) {
  const categories = Array.from(new Set(incompletedTask.map(task => task.category)));

  useEffect(() => {
    fetchTask();
  }, [updateList]);

  useEffect(() => {
    fetchTask();
  }, [checked]);

  const handlePurchasedTask = (id) => {
    const purchasedTask = completedTask.find(task => task.task_id === id);
    handleCompletedTask(id);
    // You can modify the behavior here, like moving to a 'Purchased' category
  };

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
                  <div key={task.task_id} className={`list-group-item ${task.flash ? 'flash' : ''}`}>
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
        
        {/* Purchased Section */}
        <div className="col-md-6">
          <h6>Purchased</h6>
          <div className="list-group">
            {completedTask.map(task => (
              <div key={task.task_id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="btn btn-light"
                    style={{ textDecoration: 'line-through' }}
                    onClick={() => handlePurchasedTask(task.task_id)}
                  >
                    {task.task_name}
                  </button>
                  <div>
                    <button
                      className="btn btn-danger me-2"
                      onClick={() => handleDeleteTask(task.task_id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
