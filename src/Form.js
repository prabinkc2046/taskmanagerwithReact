import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Suggestions from './Suggestions';

export default function Form({ handleSubmitForm, taskNameRef, categoryRef, handleSuggestionClick, handleInputChange, suggestions }) {
  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmitForm} className="row g-3">
        <div className="col-12">
          <div className="input-group">
            <input
              ref={taskNameRef}
              type="text"
              className="form-control"
              placeholder="Type your shopping item"
              required
              onChange={handleInputChange}
            />
            <select ref={categoryRef} className="form-select form-select-sm" aria-label="Major Grocery Category" defaultValue="">
              <option value="" disabled>Choose a category</option>
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
              <option value="Cleaning Supplies">Cleaning Supplies</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Baby Care">Baby Care</option>
              <option value="Pet Supplies">Pet Supplies</option>
              <option value="Office & School">Office & School</option>
              <option value="Electronics">Electronics</option>
              {/* Add more categories as needed */}
            </select>
            <button type="submit" className="btn btn-secondary">Add</button>
          </div>
          <Suggestions 
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          />
        </div>
      </form>
    </div>
  );
}
