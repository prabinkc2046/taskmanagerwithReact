import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export default function Suggestions({ suggestions, handleSuggestionClick }) {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

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
    <ul className="list-group">
      {suggestions.map((task) => (
        <li
          key={task.task_id}
          onClick={() => suggestionSelection(task)}
          className={`list-group-item ${selectedSuggestion === task ? 'active' : 'list-group-item-secondary'}`}
        >
          {task.task_name} ({task.category})
        </li>
      ))}
    </ul>
  );
}
