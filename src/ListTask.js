import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the times icon
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
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    fetchTask();
  }, [updateList, checked]);

  const handlePurchasedTask = (id) => {
    const purchasedTask = completedTask.find(task => task.task_id === id);
    handleCompletedTask(id);
    // You can modify the behavior here, like moving to a 'Purchased' category
  };

  const handleIncompleteTaskClick = (id) => {
    handleTaskCompleteStatus(id);
  };

  const toggleAccordion = (category) => {
    setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
  };

  const handleCompletedTaskDelete = (id) => {
    handleDeleteTask(id);
  };

  const handleMoveToPurchased = (id) => {
    handleCompletedTask(id);
  };

  return (
    <div className="container mt-5">
      <div className="accordion" id="accordionFlushExample">
        {categories.map((category, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button collapsed ${activeAccordion === category ? 'active' : ''}`}
                type="button"
                onClick={() => toggleAccordion(category)}
                aria-expanded={activeAccordion === category}
                aria-controls={`collapse-${index}`}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem' }} // Adjust left padding
              >
                <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-danger">
                  {incompletedTask.filter(task => task.category === category).length}
                  <span className="visually-hidden">unread messages</span>
                </span>
                <span className="d-inline-block">{category}</span>
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${activeAccordion === category ? 'show' : ''}`}
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <div className="list-group">
                  {incompletedTask
                    .filter(task => task.category === category)
                    .map(task => (
                      <button
                        key={task.task_id}
                        className={`list-group-item ${task.flash ? 'flash' : ''}`}
                        onClick={() => handleIncompleteTaskClick(task.task_id)}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{task.task_name}</span>
                          <button
                            className="btn btn-danger"
                            style={{ backgroundColor: 'yellow' }} // Yellow background color
                            onClick={() => handleMoveToPurchased(task.task_id)} // Move to purchased section
                          >
                            <FontAwesomeIcon icon={faTimes} style={{ color: 'black' }} /> {/* Black cross icon */}
                          </button>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
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
                  <button
                    className="btn btn-danger"
                    style={{ backgroundColor: 'white' }} // White background color
                    onClick={() => handleCompletedTaskDelete(task.task_id)} // Handle delete for completed task
                  >
                    <FontAwesomeIcon icon={faTrash} style={{ color: 'black' }} /> {/* Black trash icon */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  );
}
