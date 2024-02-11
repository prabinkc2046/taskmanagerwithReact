import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Suggestions from './Suggestions';

export default function Form({ handleSubmitForm, taskNameRef, categoryRef, handleSuggestionClick, handleInputChange, suggestions, removeSuggestion }) {
  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmitForm} className="row g-3">
        <div className="col-12">
          <div  className="input-group">
            <input
              style={{fontSize:'large'}}
              ref={taskNameRef}
              type="text"
              className="form-control"
              placeholder="Grocery item"
              required
              onChange={handleInputChange}
            />
            <select  style={{fontSize:'large'}} ref={categoryRef} className="form-select form-select-sm" aria-label="Major Grocery Category" defaultValue="">
            <option value="" disabled>Select aisle</option>
            <option value="Fresh Produce">🥦 Fresh Produce</option>
            <option value="Dairy Products">🥛 Dairy Products</option>
            <option value="Meat and Poultry">🍗 Meat and Poultry</option>
            <option value="Bakery Items">🍞 Bakery Items</option>
            <option value="Frozen Foods">❄️ Frozen Foods</option>
            <option value="Snacks and Confectionery">🍿 Snacks and Confectionery</option>
            <option value="Beverages">🍺 Beverages</option>
            <option value="Pantry Staples">🍚 Pantry Staples</option>
            <option value="Cleaning and Household Products">🧹 Cleaning and Household Products</option>
            <option value="Personal Care">🧼 Personal Care</option>
            <option value="Miscellaneous">🎉 Miscellaneous</option>

              {/* Add more categories as needed */}
            </select>
            <button style={{fontSize:'large'}}type="submit" className="btn btn-secondary">Add Item</button>
          </div>
          <Suggestions 
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          removeSuggestion={removeSuggestion}
          />
        </div>
      </form>
    </div>
  );
};
