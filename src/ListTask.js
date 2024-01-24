import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
export default function ListTask({updateList, fetchTask, handleTaskCompleteStatus, checked, completedTask, incompletedTask, handleCompletedTask, handleDeleteTask}) {
  useEffect(() => {
    fetchTask();
  },[updateList]);

  useEffect(() => {
    fetchTask();
  },[checked]);

  
  return (
    <div class="container mt-5">
  <div class="row">
    <div class="col-md-6">
      <h6>Shopping lists</h6>
      <div class="list-group">
        {incompletedTask.map(task => (
          <div
            key={task.task_id}
            class={`list-group-item ${task.flash ? 'flash' : ''}`}
          >
            <div class="d-flex justify-content-between align-items-center">
              <button
                class="btn btn-light"
                onClick={() => handleTaskCompleteStatus(task.task_id)}
              >
                {task.task_name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div class="col-md-6 mt-md-0 mt-4">
      <h6>Purchased</h6>
      <div class="list-group">
        {completedTask.map((task) => (
          <div key={task.task_id} class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <button
                class="btn btn-light"
                style={{ textDecoration: 'line-through' }}
                onClick={() => handleCompletedTask(task.task_id)}
              >
                {task.task_name}
              </button>
              <div>
                <button
                  class="btn btn-danger me-2"
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
  
  )
};
