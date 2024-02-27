import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function Suggestions({ suggestions, handleSuggestionClick, removeSuggestion }) {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const suggestionListRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionListRef.current && !suggestionListRef.current.contains(event.target)) {
        removeSuggestion();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [removeSuggestion]);

  useEffect(() => {
    if (selectedSuggestion) {
      const timer = setTimeout(() => {
        setSelectedSuggestion(null);
        handleSuggestionClick(selectedSuggestion);
      }, 250); // Change this value to adjust the duration the suggestion stays active
      return () => clearTimeout(timer);
    }
  }, [selectedSuggestion, handleSuggestionClick]);

  const suggestionSelection = (item) => {
    setSelectedSuggestion(item);
  };

  return (
    <>
    <ul ref={suggestionListRef} className="list-group">
      {suggestions.map((obj) => (
        <li
          key={obj.task_id || obj._id}
          onClick={() => suggestionSelection(obj)}
          className={`list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-success ${selectedSuggestion === obj ? 'active' : 'list-group-item-secondary'}`}
        >
          {obj.task_name || obj.item} 

          <span className="badge bg-info rectangle-pill">{obj.category}</span>
        </li>
      ))}
      </ul>
    </>
  );
}
