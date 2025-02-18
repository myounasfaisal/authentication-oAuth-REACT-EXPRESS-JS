import React from "react";

export default function Form({ children, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data from the DOM
    const data = Object.fromEntries(formData.entries()); // Convert to a plain object
    onSubmit(data); // Pass the form data to the parent component
  };

  return (
    <form onSubmit={handleSubmit}>
      {children} {/* Render children as-is */}
    </form>
  );
}