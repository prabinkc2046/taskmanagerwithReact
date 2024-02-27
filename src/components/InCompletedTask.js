import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/ListTask.css';

// Changed the component name to start with uppercase "I"
export default function InCompletedTask({
  incompletedTask,
  toggleAccordion,
  activeAccordion,
  handleIncompleteTaskClick,
  completedTask,
  categories,
  daysSinceLastEmptyTask
}) {
  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif' }} className="container mt-5">
        {incompletedTask.length > 0 && (
          <div className="h4 pb-2 mb-4 text-secondary border-bottom border-secondary">
            Ready to shop? Total items 
            <span className="badge text-bg-secondary" style={{ paddingTop: '3px', paddingBottom: '3px', paddingLeft: '4px', paddingRight: '4px' }}>
              {incompletedTask.length}
            </span>
          </div>
        )}

        <p></p>

        <div className="accordion" id="accordionFlushExample">
          {categories.map((category, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header custom-header">
                <button
                  className={`accordion-button  ${activeAccordion === category ? '' : 'collapsed'}`}
                  style={{ padding: '12px' }}
                  type="button"
                  onClick={() => toggleAccordion(category)}
                  aria-expanded={activeAccordion === category}
                  aria-controls={`collapse-${index}`}
                >
                  <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-secondary" style={{ paddingTop: '2px', paddingBottom: '2px', paddingLeft: '4px', paddingRight: '4px' }}>
                    {incompletedTask.filter(task => task.category === category).length}
                  </span>
                  <span className="d-inline-block" style={{ paddingLeft: '7px', fontSize: '2vh' }}>{category}</span>
                </button>
              </h2>
              <div
                id={`collapse-${index}`}
                className={`accordion-collapse collapse ${activeAccordion === category ? 'show' : ''}`}
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body" style={{ padding: '10px' }}>
                  <div className="list-group">
                    {incompletedTask
                      .filter(task => task.category === category)
                      .map(task => (
                        <button
                          key={task.task_id}
                          className={`list-group-item  ${task.flash ? 'flash' : ''}`}
                          style={{ padding: '10px' }}
                          onClick={() => handleIncompleteTaskClick(task.task_id)}
                        >
                          <div className="d-flex justify-content-between align-items-center btn btn-light" style={{ padding: '0px' }}>
                            <span className='custom-items' style={{ paddingLeft: '10px' }}>{task.task_name}</span>
                            <button className="btn btn-danger" style={{ backgroundColor: '#6c757d', borderColor: 'white' }}>
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
            <div style={{ fontSize: 'small', fontWeight: 'bold', color: 'black' }} className="card text-center ">
              <div className="card-body">
                {incompletedTask.length === 0 ? (
                  <p className='card-text'>Hooray! Your shopping list is currently empty</p>
                ) : (
                  <h5 className="card-title">Special title treatment</h5>
                )}
              </div>
              <div className="card-footer text-body-secondary">
                {daysSinceLastEmptyTask && `Last shopping ${daysSinceLastEmptyTask} day${daysSinceLastEmptyTask !== 1 ? 's' : ''} ago`}
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
