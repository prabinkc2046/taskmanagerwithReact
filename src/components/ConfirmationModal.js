import React from 'react';

export default function ConfirmationModal({ showModal, handleModalConfirmation }) {
  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Duplicate Item</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleModalConfirmation(false)}></button>
          </div>
          <div className="modal-body">
            This item is already listed. Would you like to add it again?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => handleModalConfirmation(false)}>No</button>
            <button type="button" className="btn btn-primary" onClick={() => handleModalConfirmation(true)}>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
