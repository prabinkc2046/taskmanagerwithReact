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
  categories,
  handleIncompleteTaskClick,
  daysSinceLastEmptyTask,
  purchasedDates,
  handlePurchasedTask,
  handleCompletedTaskDelete
}) {
  return (
    <>
      <div style={{ fontFamily: 'Arial, sans-serif' }} className="container mt-5">
        {incompletedTask.length > 0 && (
          <div class="h4 pb-2 mb-4 text-secondary border-bottom border-secondary">
            Ready to shop? Total items <span class="badge text-bg-secondary">{incompletedTask.length}</span>
          </div>
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
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontStyle: 'italic', fontSize: 'large' }}
                >
                  <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-secondary">
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
                            <span style={{ color: 'black', fontStyle: 'italic', fontSize: 'medium' }}>{task.task_name}</span>
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
        <p></p>
        {completedTask.length > 0 && (
          <div>
            <div class="p-0 mb-2 rounded-start rounded-end d-flex justify-content-center align-items-center">
              <button style={{ fontSize: 'small' }} className="btn  p-1 border-secondary text-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                Tap to see purchased items <span class="badge text-bg-secondary">{completedTask.length}</span>
              </button>
            </div>

            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Purchased history <span class="badge bg-secondary">{completedTask.length}</span></h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <div className="accordion" id="accordionFlushExample">
                  {purchasedDates.map((purchasedDate, index) => (
                    <div className="accordion-item" key={index}>
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${activeAccordion === purchasedDate ? '' : 'collapsed'}`}
                          type="button"
                          onClick={() => toggleAccordion(purchasedDate)}
                          aria-expanded={activeAccordion === purchasedDate}
                          aria-controls={`collapse-${index}`}
                          style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontStyle: 'italic', fontSize: 'large' }}
                        >
                          <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-secondary">
                            {completedTask.filter(task => task.purchasedDate === purchasedDate).length}
                            <span className="visually-hidden">unread messages</span>
                          </span>
                          <span className="d-inline-block">{purchasedDate}</span>
                        </button>
                      </h2>
                      <div
                        id={`collapse-${index}`}
                        className={`accordion-collapse collapse ${activeAccordion === purchasedDate ? 'show' : ''}`}
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body">
                          <div className="list-group">
                            {completedTask
                              .filter(task => task.purchasedDate === purchasedDate)
                              .map(task => (
                                <li key={task.task_id} className="list-group-item">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <button
                                      className="btn btn-secondary"
                                      style={{ textDecoration: 'line-through', textDecorationColor: 'black', fontStyle: 'italic', textDecorationThickness: '2px', color: 'white' }}
                                      onClick={() => handlePurchasedTask(task.task_id)}
                                    >
                                      <span style={{ fontSize: 'medium' }}>{task.task_name}</span>
                                    </button>

                                    <button
                                      className="btn btn-light"
                                      style={{ fontStyle: 'italic', textDecorationThickness: '2px', color: 'black' }}
                                    >
                                      <span style={{ fontSize: 'medium' }}>{task.category}</span>
                                    </button>

                                    <button
                                      className="btn btn-light"
                                      onClick={() => handleCompletedTaskDelete(task.task_id)}
                                    >
                                      <FontAwesomeIcon icon={faTrash} style={{ color: 'black' }} />
                                    </button>
                                  </div>
                                </li>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
