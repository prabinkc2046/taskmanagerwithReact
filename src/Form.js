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
              placeholder="Enter grocery item..."
              required
              onChange={handleInputChange}
            />
            <select ref={categoryRef} className="form-select form-select-sm" aria-label="Major Grocery Category" defaultValue="">
            <option value="" disabled>Select aisle category</option>
            <option value="Produce">Fresh Produce</option>
            <option value="Dairy">Dairy Products</option>
            <option value="Meat">Meat and Poultry</option>
            <option value="Bakery">Bakery Items</option>
            <option value="Frozen">Frozen Foods</option>
            <option value="Snacks">Snacks and Confectionery</option>
            <option value="Beverages">Beverages</option>
            <option value="Pantry">Pantry Staples</option>
            <option value="Household">Cleaning and Household Products</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Miscellaneous">Miscellaneous</option>

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
