import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function 
({onSubmit, taskNameRef}) {
  return (
    <div className="container mt-4">
    <form onSubmit={onSubmit} className="row g-3">
      <div className="col-12">
        
        <div className="input-group">
          <input
            ref={taskNameRef}
            type="text"
            className="form-control"
            
            placeholder="Type your shopping item"
            required
          />
          <button type="submit" className="btn btn-secondary">Add</button>
        </div>
      </div>
    </form>
  </div>
  
  )
}
