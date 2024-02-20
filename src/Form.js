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
            <select style={{fontSize:'large'}} ref={categoryRef} className="form-select form-select-sm" aria-label="Major Grocery Category" defaultValue="">
            <option value="" disabled>Select aisle</option>
            <option value="fresh produce">🥦 Fresh Produce</option>
            <option value="dairy products">🥛 Dairy Products</option>
            <option value="meat and poultry">🍗 Meat and Poultry</option>
            <option value="bakery items">🍞 Bakery Items</option>
            <option value="frozen foods">❄️ Frozen Foods</option>
            <option value="snacks and confectionery">🍿 Snacks and Confectionery</option>
            <option value="beverages">🍺 Beverages</option>
            <option value="pantry staples">🍚 Pantry Staples</option>
            <option value="cleaning household products">🧹 Cleaning and Household Products</option>
            <option value="personal care">🧼 Personal Care</option>
            <option value="miscellaneous">🎉 Miscellaneous</option>

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
