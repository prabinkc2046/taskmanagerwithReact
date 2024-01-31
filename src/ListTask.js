import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.css';

export default function ListTask({
  fetchTask,
  handleTaskCompleteStatus,
  completedTask,
  incompletedTask,
  handleCompletedTask,
  handleDeleteTask,
  removeSuggestion,
  toggleAccordion,
  activeAccordion,
}) {
  const [sortedCategory, setSortedCategory] = useState([]);
  const [lastEmptyTaskTime, setLastEmptyTaskTime] = useState(null);
  const [daysSinceLastEmptyTask, setDaysSinceLastEmptyTask] = useState(null);
  const categories = Array.from(new Set(sortedCategory.map(task => task.category)));

  useEffect(() => {
    processTasks(incompletedTask);
  }, [incompletedTask]);

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

  useEffect(() => {
    if (lastEmptyTaskTime) {
      const currentDate = new Date();
      const differenceInTime = Math.abs(currentDate - lastEmptyTaskTime);
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
      setDaysSinceLastEmptyTask(differenceInDays);
    }
  }, [lastEmptyTaskTime]);

  const handlePurchasedTask = (id) => {
    handleCompletedTask(id);
  };

  const handleIncompleteTaskClick = (id) => {
    handleTaskCompleteStatus(id);
  };

  const handleMoveToPurchased = (id) => {
    handleCompletedTask(id);
  };

  const handleCompletedTaskDelete = (id) => {
    handleDeleteTask(id);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}className="container mt-5">
    {incompletedTask.length > 0 && (
      <button type="button" class="btn btn-success position-relative">
      Your shopping list for today
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
      {incompletedTask.length}
        <span class="visually-hidden">unread messages</span>
      </span>
    </button>
    )}

    <p></p>
      <div className="accordion" id="accordionFlushExample">
        {categories.map((category, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${activeAccordion === category ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggleAccordion(category)}
                aria-expanded={activeAccordion === category}
                aria-controls={`collapse-${index}`}
                style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontStyle:'italic', fontSize:'small'}}
              >
                <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-info">
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
                        <div className="d-flex justify-content-between align-items-center btn btn-light">
                          <span style={{color:'black', fontStyle: 'italic', fontSize:'small'}}>{task.task_name}</span>
                          <button className="btn btn-danger" style={{ backgroundColor: 'green', borderColor: 'white'}}>
                            <FontAwesomeIcon icon={faTimes} style={{ color: 'white' }} />
                          </button>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* This section will appear when there are no items in the list */}
        {incompletedTask.length === 0 && (
          <div style={{fontSize:'small', fontWeight:'bold', color:'black'}} className="card text-center ">
          <div  className="card-body">
            {incompletedTask.length === 0 ? (
              <p className='card-text'>Hooray! Your shopping list is clear! See you next time!</p>
            ) : (
              <h5 className="card-title">Special title treatment</h5>
            )}
          </div>
          <div className="card-footer text-body-secondary">
            {daysSinceLastEmptyTask && `Last shopping ${daysSinceLastEmptyTask} day${daysSinceLastEmptyTask !== 1 ? 's' : '' } ago`}
          </div>
        </div>
        )}
         <p></p>
        {/* Code for Purchased category */}
        <div className="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${activeAccordion === 'Purchased' ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('Purchased')}
              aria-expanded={activeAccordion === 'Purchased'}
              aria-controls={`collapse-purchased`}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontSize:'small'}}
            >
              <span className="d-inline-block">
                <button type="button" class="btn btn-secondary position-relative">
                Checked Off items
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
              {completedTask.length}
                <span class="visually-hidden">unread messages</span>
             </span>
            </button>
              </span>
            </button>
          </h2>
          <div
            id={`collapse-purchased`}
            className={`accordion-collapse collapse ${activeAccordion === 'Purchased' ? 'show' : ''}`}
            aria-labelledby={`heading-purchased`}
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <div className="list-group">
                {completedTask.map(task => (
                  <div key={task.task_id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-light"
                        style={{ textDecoration: 'line-through', textDecorationColor: 'blue', fontStyle: 'italic', textDecorationThickness: '2px', color: 'black' }}
                        onClick={() => handlePurchasedTask(task.task_id)}
                      >
                        {task.task_name}
                      </button>
                      <button
                        className="btn btn-light"
                        onClick={() => handleCompletedTaskDelete(task.task_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} style={{ color: 'black' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
