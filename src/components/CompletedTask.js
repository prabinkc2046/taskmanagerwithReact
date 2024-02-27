import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/ListTask.css';

export default function CompletedTask({
  categories,
  completedTask,
  purchasedDates,
  handlePurchasedTask,
  handleCompletedTaskDelete,
  activeAccordion,
  toggleAccordion
}) {
  return (
    <>
      <p></p>
      <div style={{ fontFamily: 'Arial, sans-serif' }} className="container mt-5">
        {completedTask.length > 0 && (
          <div>
            <div class="p-0 mb-2 rounded-start rounded-end d-flex justify-content-center align-items-center">
              <button style={{ fontSize: 'small' }} className="btn  p-1 border-secondary text-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
                Tap to see purchased items <span class="badge text-bg-secondary">{completedTask.length}</span>
              </button>
            </div>

            <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Purchased history <span class="badge bg-secondary" style={{ paddingTop: '4px', paddingBottom: '2px', paddingLeft: '4px', paddingRight: '4px' }}>{completedTask.length}</span></h5>
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
                          style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '7px', fontStyle: 'italic', fontSize: 'large' }}
                        >
                          <span className="position-absolute top-50 start-0 translate-middle badge rounded-pill bg-secondary" style={{ paddingTop: '2px', paddingBottom: '2px', paddingLeft: '4px', paddingRight: '4px' }}>
                            {completedTask.filter(task => task.purchasedDate === purchasedDate).length}
                            <span className="visually-hidden">unread messages</span>
                          </span>
                          <span className="d-inline-block" style={{ fontSize: '2vh', paddingTop: '4px', paddingBottom: '2px', paddingLeft: '20px', paddingRight: '4px' }}>{purchasedDate}</span>
                        </button>
                      </h2>
                      <div
                        id={`collapse-${index}`}
                        className={`accordion-collapse collapse ${activeAccordion === purchasedDate ? 'show' : ''}`}
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div className="accordion-body" style={{ paddingLeft: '1vw', paddingRight: '1vw', paddingTop: '1vh', paddingBottom: '1vh' }}>
                          <div className="list-group">
                            {completedTask
                              .filter(task => task.purchasedDate === purchasedDate)
                              .map(task => (
                                <li key={task.task_id} className="list-group-item" style={{ padding: '0' }}>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <button
                                      className="btn btn-light"
                                      style={{ textDecoration: 'line-through', textDecorationColor: 'black', textDecorationThickness: '2px', color: 'black', padding: '0px' }}
                                      onClick={() => handlePurchasedTask(task.task_id)}
                                    >
                                      <span style={{ fontSize: 'medium', paddingLeft: '1.5vw' }}>{task.task_name}</span>
                                    </button>
                                    <button
                                      className="btn btn-light"
                                      style={{ paddingLeft: '1vw' }}
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
