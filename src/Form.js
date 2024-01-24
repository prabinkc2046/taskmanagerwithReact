import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function Form({ onSubmit, taskNameRef, categoryRef }) {
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
            <select ref={categoryRef} className="form-select form-select-sm" aria-label="Major Grocery Category">
              <option value="Choose a category" disabled>Choose a category</option>
              <option value="Produce">Produce</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Bakery">Bakery</option>
              <option value="Frozen">Frozen</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Pantry">Pantry</option>
              <option value="Household">Household</option>
              <option value="Personal Care">Personal Care</option>
              {/* Add more categories as needed */}
            </select>
            <button type="submit" className="btn btn-secondary">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
}
