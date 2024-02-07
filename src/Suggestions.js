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

  const suggestionSelection = (task) => {
    setSelectedSuggestion(task);
  };

  return (
    <ul ref={suggestionListRef} className="list-group">
      {suggestions.map((task) => (
        <li
          key={task.task_id}
          onClick={() => suggestionSelection(task)}
          className={`list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-success ${selectedSuggestion === task ? 'active' : 'list-group-item-secondary'}`}
        >
          {task.task_name} 
          <span className="badge bg-info rectangle-pill">{task.category}</span>
        </li>
      ))}
    </ul>
  );
}
