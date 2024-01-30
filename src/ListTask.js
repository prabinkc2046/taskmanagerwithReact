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
  // const [activeAccordion, setActiveAccordion] = useState(null);
  const categories = Array.from(new Set(sortedCategory.map(task => task.category)));

  useEffect(() => {
    processTasks(incompletedTask);
  }, [incompletedTask]);

  function processTasks(incompletedTasks) {
    // Step 1: Filter the items to get the highest task_id for each category
    const categoryTasks = {};
    incompletedTasks.forEach(task => {
      if (!categoryTasks[task.category] || task.task_id > categoryTasks[task.category].task_id) {
        categoryTasks[task.category] = { category: task.category, task_id: task.task_id };
      }
    });
  
    // Step 2: Sort the categoryTasks array based on decreasing order of task_id
    const sortedCategoryTasks = Object.values(categoryTasks).sort((a, b) => b.task_id - a.task_id);
    // return sortedCategoryTasks;
    setSortedCategory(sortedCategoryTasks);
  };
  
  
  const handlePurchasedTask = (id) => {
    handleCompletedTask(id);
  };

  const handleIncompleteTaskClick = (id) => {
    handleTaskCompleteStatus(id);
  };

  // const toggleAccordion = (category) => {
  //   setActiveAccordion(prevCategory => (prevCategory === category ? null : category));
    
  //   // remove the suggestion in case user clicks on the add task and do not add task
  //   removeSuggestion();
  // };

  const handleMoveToPurchased = (id) => {
    handleCompletedTask(id);
  };

  const handleCompletedTaskDelete = (id) => {
    handleDeleteTask(id);
  };

  return (
    <div className="container mt-5">
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
                style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontWeight: 'bold' }}
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
                        <div className="d-flex justify-content-between align-items-center btn btn-light">
                          <span style={{color:'black', fontStyle: 'italic'}}>{task.task_name}</span>
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

        {/* Code for Purchased category */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${activeAccordion === 'Purchased' ? '' : 'collapsed'}`}
              type="button"
              onClick={() => toggleAccordion('Purchased')}
              aria-expanded={activeAccordion === 'Purchased'}
              aria-controls={`collapse-purchased`}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontWeight:'bold'}}
            >
              <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-danger">
                {completedTask.length}
                <span className="visually-hidden">unread messages</span>
              </span>
              <span className="d-inline-block">Purchased</span>
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
                        style={{ textDecoration: 'line-through', textDecorationColor: '#B2BEB5', fontStyle: 'italic', textDecorationThickness: '2px', color: 'black' }}
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
  );
}
