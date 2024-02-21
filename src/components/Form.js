import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Suggestions from './Suggestions';
import '../styles/Form.css';

export default function Form({ handleSubmitForm, taskNameRef, categoryRef, handleSuggestionClick, handleInputChange, suggestions, removeSuggestion, dbHasData, historyHasData, Oursuggestions }) {
  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmitForm} className="row g-3 ">
        <div className="col-12">
          <div  className="input-group">
            <input
              ref={taskNameRef}
              type="text"
              className="form-control"
              style={{fontSize:'2vh'}}
              placeholder="Grocery item"
              required
              onChange={handleInputChange}
            />
            <select  ref={categoryRef} className="form-select form-select-sm custom-select" aria-label="Major Grocery Category" defaultValue="">
            <option value="" disabled>Select aisle</option>
            <option value="fresh produce">🥦 Fresh Produce</option>
            <option value="Dairy Products">🥛 Dairy Products</option>
            <option value="Meat And Poultry">🍗 Meat and Poultry</option>
            <option value="Bakery Items">🍞 Bakery Items</option>
            <option value="Frozen Foods">❄️ Frozen Foods</option>
            <option value="Snacks And Confectionery">🍿 Snacks and Confectionery</option>
            <option value="Beverages">🍺 Beverages</option>
            <option value="Pantry Staples">🍚 Pantry Staples</option>
            <option value="Cleaning Household Products">🧹 Cleaning and Household Products</option>
            <option value="Personal Care">🧼 Personal Care</option>
            <option value="Miscellaneous">🎉 Miscellaneous</option>

              {/* Add more categories as needed */}
            </select>
            <button type="submit" className="btn btn-secondary" style={{padding:'7.5px', fontSize:'2vh'}}>Add Item</button>
          </div>
          <Suggestions 
          suggestions={suggestions}
          dbHasData={dbHasData}
          handleSuggestionClick={handleSuggestionClick}
          removeSuggestion={removeSuggestion}
          historyHasData={historyHasData}
          Oursuggestions={Oursuggestions}
          />
        </div>
      </form>
    </div>
  );
};
